import User from '../models/User';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';
// RootRouter
export const getJoin = (req, res) => res.render('join', { pageTitle: 'Join' });
export const postJoin = async (req, res) => {
  try {
    const { email, username, password, password2, name, location } = req.body;
    const pageTitle = 'Join';
    let errMsg;
    if (password !== password2) {
      errMsg = 'Password confirmation does not match.';
      return res.status(400).render('join', { pageTitle, errMsg });
    }
    const chkUnique = await User.exists({ $or: [{ username }, { email }] });
    if (chkUnique) {
      errMsg = '이미 존재하는 Email/Username입니다.';
      return res.status(400).render('join', { pageTitle, errMsg });
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
    return res
      .status(400)
      .render('join', { pageTitle: 'Join', errMsg: err._message });
  }
};
export const getLogin = (req, res) => {
  return res.render('login', { pageTitle: 'Log In' });
};
export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const pageTitle = 'Log In';
  try {
    // email, pw로 로그인을 하는 상황이기 때문에, socialOnly가 false인 경우만 불러온다.
    const user = await User.findOne({ email, socialOnly: false });
    let errMsg;
    if (!user) {
      errMsg = `${email} - This email is not registerd.`;
      return res.status(400).render('login', { pageTitle, errMsg });
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      errMsg = 'Wrong password';
      return res.status(400).render('login', { pageTitle, errMsg });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect('/');
  } catch (err) {
    console.log(err);
    return res.status(400).render('login', {
      pageTitle,
      errorMsg: err._message,
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
  try {
    const baseUrl = 'https://github.com/login/oauth/access_token';
    const config = {
      client_id: process.env.GH_CLIENT,
      client_secret: process.env.GH_SECRET,
      code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const fetchRequest = await (
      await fetch(finalUrl, {
        method: 'post',
        headers: {
          Accept: 'application/json',
        },
      })
    ).json();
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
        return res.redirect('/login');
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
          name: userData.name ?? 'Unknown',
          location: userData.location ?? '',
        });
      }
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect('/');
    } else {
      return res.redirect('/login');
    }
  } catch (err) {
    console.log(err);
    return res.status(400).redirect('/');
  }
};
export const logout = (req, res) => {
  // session의 정보를 파괴하는것으로 현재의 session - 로그인 유저의 정보를 제거한다.
  req.session.destroy();
  return res.redirect('/');
};

export const getEdit = (req, res) => {
  return res.render('edit-profile', { pageTitle: 'Edit Profile' });
};
export const postEdit = async (req, res) => {
  try {
    const {
      session: {
        user: { _id, email: currentEmail, username: currentUsername },
      },
      body: { email, username, name, location },
    } = req;
    // 변화 체크 -> 중복 체크
    let 

    const updatedUser = await User.findByIdAndUpdate(_id, toChange, {
      new: true,
    });
    req.session.user = updatedUser;
    // findByUpdatd "Options" {new:true} => return new Obj
    // req.session.user = { ...req.session.user, email, username, name, location };
    return res.redirect('/');
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .render('edit-profile', { pageTitle: 'Edit Profile' });
  }
};
// UserRouter
export const profile = (req, res) => res.send('See Profile');
export const edit = (req, res) => res.send('Edit Profile');
export const remove = (req, res) => res.send('Remove Profile');
