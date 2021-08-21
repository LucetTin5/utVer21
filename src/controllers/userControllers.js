import User from '../models/User';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';
import { isHeroku } from '../middlewares';
// RootRouter
export const getJoin = (req, res) =>
  res.render('./users/join', { pageTitle: 'Join' });
export const postJoin = async (req, res) => {
  const { email, username, password, password2, name, location } = req.body;
  try {
    if (password !== password2) {
      req.flash('error', 'Password confirmation does not match.');
      throw new Error('Password confirmation does not match.');
    }
    const chkUnique = await User.exists({ $or: [{ username }, { email }] });
    if (chkUnique) {
      req.flash('error', 'This email/username is already exists.');
      throw new Error('This email/username is already taken.');
    }
    await User.create({
      email,
      username,
      password,
      name,
      location,
    });
    return res.redirect('/');
  } catch (err) {
    console.log(err);
    return res.status(400).render('./users/join', {
      pageTitle: 'Join',
      errMsg: err.message || err._message,
    });
  }
};
export const getLogin = (req, res) => {
  return res.render('./users/login', { pageTitle: 'Log In' });
};
export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const pageTitle = 'Log In';
  try {
    // email, pw로 로그인을 하는 상황이기 때문에, socialOnly가 false인 경우만 불러온다.
    const user = await User.findOne({ email, socialOnly: false });
    if (!user) {
      req.flash('error', 'This email is not registerd.');
      throw new Error(`${email} - This email is not registerd.`);
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      req.flash('error', 'Wrong password.');
      throw new Error('Wrong password');
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect('/');
  } catch (err) {
    console.log(err);
    return res.status(400).render('./users/login', {
      pageTitle,
      errMsg: err.message || err._message,
    });
  }
};

export const startGitHubLogin = (req, res) => {
  const baseUrl = `https://github.com/login/oauth/authorize`;
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: 'read:user user:email',
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGitHubLogin = async (req, res) => {
  // auth 진행 -> code를 받아옴, code를 기반으로 access token을 요청함
  console.log(req.query.code, '\n');
  const baseUrl = 'https://github.com/login/oauth/access_token';
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  console.log('finalUrl: ', finalUrl);
  try {
    const fetchRequest = await (
      await fetch(finalUrl, {
        method: 'post',
        headers: {
          Accept: 'application/json',
        },
      })
    ).json();
    console.log(fetchRequest, '\n', fetchRequest.access_token);
    // 받아온 access_token을 이용, GH api에 post 요청을 보내 허용된 정보를 받아옴
    // API가 ~user이기 때문에 read:user에 해당하는 정보만 받아오게 되어, email 정보는 새로운 fetch를 실행해야 함
    if ('access_token' in fetchRequest) {
      const { access_token } = fetchRequest;
      const API_URL = 'https://api.github.com/';
      const userData = await (
        await fetch(`${API_URL}user`, {
          method: 'GET',
          headers: {
            Authorization: `token ${access_token}`,
          },
        })
      ).json();
      const emailData = await (
        await fetch(`${API_URL}user/emails`, {
          method: 'GET',
          headers: {
            Authorization: `token ${access_token}`,
          },
        })
      ).json();
      const emailObj = emailData.find(
        (email) => email.verified === true && email.primary === true
      );
      if (!emailObj) {
        // 이메일이 존재하지 않는 경우 오류메시지 알림을 주게 될 것
        req.flash('error', 'No Email');
        return res.status(400).redirect('/login');
      }
      // 이메일이 존재한다. 로그인을 시켜주자
      // 이때 DB에 존재하는 유저라면 로그인상태 설정 및 바로 연결 - socialOnly는 false에서 변경하지 않는다.
      // 저장된 이메일에 대해 유저가 다른 방식 접근 시 어떻게 진행할 지는 생각 후 결정
      let user = await User.findOne({ email: emailObj.email });
      if (!user) {
        // DB에 존재하지 않는 새로운 유저가 github로그인을 시도한다는 뜻
        user = await User.create({
          email: emailObj.email,
          avatarUrl: userData.avatar_url,
          socialOnly: true,
          username: userData.login,
          password: '',
          name:
            userData.name ??
            `SocialUser_${String(new Date().valueOf()).slice(0, 6)}`,
          location: userData.location ?? '',
        });
      }
      req.session.loggedIn = true;
      req.session.user = user;
      req.flash('info', `Hello, ${user.name}`);
      return res.redirect('/');
    } else {
      return res.redirect('/login');
    }
  } catch (err) {
    console.log(err);
    req.flash('error', 'Github login failed');
    return res.status(400).redirect('/');
  }
};
export const logout = (req, res) => {
  // session의 정보를 파괴하는것으로 현재의 session - 로그인 유저의 정보를 제거한다.
  req.flash('info', 'Bye Bye');
  req.session.destroy();
  return res.redirect('/');
};

export const getEdit = (req, res) => {
  return res.render('./users/edit-profile', { pageTitle: 'Edit Profile' });
};
export const postEdit = async (req, res) => {
  try {
    const {
      session: {
        user: {
          _id,
          avatarUrl,
          email: currentEmail,
          username: currentUsername,
        },
      },
      body: { email, username, name, location },
      file,
    } = req;
    // email, username change?
    let diffs = [];
    if (email !== currentEmail) {
      diffs.push({ email });
    }
    if (username !== currentUsername) {
      diffs.push({ username });
    }
    if (diffs.length > 0) {
      const existingUser = await User.findOne({ $or: diffs });
      // username, email이 중복인 유저가 존재한다면
      if (existingUser && existingUser._id.toString() !== _id) {
        // 그 유저가 존재하고, 그 유저의 id값과 현재 로그인된 유저의 id값이 동일하지 않다면 -> 다른 유저의 것과 동일한 유저네임,이메일을 등록하고자 한다면
        req.flash('error', 'This email/username is already exists.');
        throw new Error('This email/username is already taken.');
      }
    }
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        avatarUrl: file ? (isHeroku ? file.location : file.path) : avatarUrl,
        email,
        username,
        name,
        location,
      },
      {
        new: true,
      }
    );
    req.session.user = updatedUser;
    // findByUpdatd "Options" {new:true} => return new Obj
    // req.session.user = { ...req.session.user, email, username, name, location };
    return res.redirect('/');
  } catch (err) {
    console.log(err);
    return res.status(400).render('/uesrs/edit-profile', {
      pageTitle: 'Edit Profile',
      errMsg: err.message || err._message,
    });
  }
};

export const getChangePassword = (req, res) => {
  const {
    session: {
      user: { socialOnly },
    },
  } = req;
  // socialOnly가 false인 경우만 비밀번호가 존재하기에
  if (!socialOnly) {
    return res.render('./users/change-password', {
      pageTitle: 'Change Password',
    });
  }
  return res.status(400).redirect('/user/edit');
};
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { current, password, password2 },
  } = req;
  try {
    // 입력된 새 비밀번호 두 칸이 동일한지 체크 => 가장 빠르다.
    if (password !== password2) {
      req.flash('error', 'Password confirmaton does not match');
      throw new Error('Password confirmation does not match.');
    }
    const user = await User.findById(_id);
    // 기존 비밀번호와 입력된 기존 비밀번호가 일치하는지 체크
    const chkCurrent = await bcrypt.compare(current, user.password);
    if (!chkCurrent) {
      req.flash('error', 'Wrong password');
      throw new Error('Wrong current password ');
    }
    user.password = password;
    await user.save();
    // user의 비밀번호가 변경되면 로그아웃시킴 -> session도 사라짐
    // 따라서 session을 따로 업데이트할 필요가 없음.
    req.flash('info', 'Password change successful. Login again.');
    return res.redirect('/user/logout');
  } catch (err) {
    console.log(err);
    return res.status(400).render('./users/change-password', {
      pageTitle: 'Change Password',
      errMsg: err.message || err._message,
    });
  }
};
export const profile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate([
      {
        path: 'videos',
        populate: {
          path: 'owner',
          model: 'User',
        },
      },
    ]);
    if (!user) {
      return res.status(404).render({ pageTitle: 'User not found.' });
    }
    return res.render('users/profile', { pageTitle: user.name, user });
  } catch (err) {
    console.log(err);
    return res.status(400).redirect('/');
  }
};
