import User from '../models/User';
import bcrypt from 'bcrypt';
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
    const user = await User.findOne({ email });
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
    return res.redirect('/');
  } catch (err) {
    console.log(err);
    return res.status(400).render('login', {
      pageTitle,
      errorMsg: err._message,
    });
  }
};

// UserRouter
export const profile = (req, res) => res.send('See Profile');
export const logout = (req, res) => res.send('Logout');
export const edit = (req, res) => res.send('Edit Profile');
export const remove = (req, res) => res.send('Remove Profile');
