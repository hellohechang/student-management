let { updateData } = require('./sqlite')


updateData(`sys_user`, { create_by: 'root', update_by: 'root', create_time: 1680147934838, update_time: 1680147934838 }, `WHERE create_by=?`, [1])