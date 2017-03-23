var config = require('config-lite');
var Mongolass = require('mongolass');
var mongolass = new Mongolass();
mongolass.connect(config.mongodb);

exports.User = mongolass.model('User', {
  accountName:{ type: 'string' },
  password:{ type: 'string' },
  name:{ type: 'string' },
  photo:{ type: 'string' },
  secDim:{ type: 'string' },
  mobile:{ type: 'number' },
  telephone:{ type: 'string' },
  mail:{ type: 'string' },
  position:{ type: 'string' },
  department:{ type: 'string' },
});
exports.User.index({ accountName: 1 }, { unique: true }).exec();// 根据用户名找到用户，用户名全局唯一

exports.Chat = mongolass.model('Chat', {
  FromId:{ type: Mongolass.Types.ObjectId },
  toId:{ type: Mongolass.Types.ObjectId },
  mes:{ type: 'string' },
  type:{ type: 'string' },
  unread:{ type: 'boolean' },
  unreadCount:{ type: 'number' }
});
exports.Chat.index({_id: 1}).exec();
