// GlobalRouter
export const join = (req, res) => res.send('Join');
export const login = (req, res) => res.send('Login');

// UserRouter
export const profile = (req, res) => res.send('See Profile');
export const logout = (req, res) => res.send('Logout');
export const edit = (req, res) => res.send('Edit MY Profile');
export const remove = (req, res) => res.send('Remove MY Profile');
