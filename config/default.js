module.exports = {
  port: 3700,
  session: {
    secret: 'shunda',
    key: 'shunda',
    maxAge: 1000*60*10
  },
  mongodb: 'mongodb://localhost:27017/shunda',
  jwt: {
    secret:'myOa'
  }
};
