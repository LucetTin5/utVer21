import User from '../models/User';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';
import axios from 'axios';
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
  // auth token -> access token -> user token
  const baseUrl = 'https://github.com/login/oauth/access_token';
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config);
  const finalUrl = `${baseUrl}?${params}`;
  const fetchRequest = await (
    await fetch(finalUrl, {
      method: 'post',
      headers: {
        Accept: 'application/json',
      },
    })
  ).json();
  if ('access_token' in fetchRequest) {
    const { access_token } = fetchRequest;
    const API_URL = 'https://api.github.com/user';
    const userRequest = await (
      await fetch(API_URL, {
        method: 'GET',
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    return res.send(userRequest);
  } else {
    return res.redirect('/login');
  }
};
// UserRouter
export const profile = (req, res) => res.send('See Profile');
export const logout = (req, res) => res.send('Logout');
export const edit = (req, res) => res.send('Edit Profile');
export const remove = (req, res) => res.send('Remove Profile');
