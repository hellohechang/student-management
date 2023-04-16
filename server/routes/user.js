let express = require('express'),
  route = express.Router();

const {
  queryData,
  insertData,
  runSqlite,
  deleteData,
  updateData,
  allSqlite,
} = require('../sqlite');
const {
  _err,
  encryption,
  _setTimeout,
  nanoid,
  jwten,
  _success,
  _nologin,
} = require('../utils');

queryData('sys_user', 'id')
  .then(() => { })
  .catch(async () => {
    try {
      await runSqlite(`CREATE TABLE sys_user (
      id          TEXT PRIMARY KEY
                       UNIQUE
                       NOT NULL,
      create_by   TEXT,
      create_time TEXT,
      remarks     TEXT,
      update_by   TEXT,
      update_time TEXT,
      password    TEXT,
      realname    TEXT,
      sex         TEXT,
      status      TEXT,
      username    TEXT,
      email       TEXT,
      user_icon   TEXT,
      role_id     TEXT
  );`);
      await runSqlite(`CREATE TABLE s_course (
      id          TEXT PRIMARY KEY
                       UNIQUE
                       NOT NULL,
      create_by   TEXT,
      create_time TEXT,
      remarks     TEXT,
      update_by   TEXT,
      update_time TEXT,
      course_name TEXT,
      course_no   TEXT
  );`);
      await runSqlite(`CREATE TABLE s_grade_class (
      id          TEXT PRIMARY KEY
                       UNIQUE
                       NOT NULL,
      create_by   TEXT,
      create_time TEXT,
      remarks     TEXT,
      update_by   TEXT,
      update_time TEXT,
      clazz       TEXT,
      code        TEXT,
      grade       TEXT,
      name        TEXT
    );`);
      await runSqlite(`CREATE TABLE s_student (
      id             TEXT PRIMARY KEY
                          UNIQUE
                          NOT NULL,
      create_by      TEXT,
      create_time    TEXT,
      remarks        TEXT,
      update_by      TEXT,
      update_time    TEXT,
      name           TEXT,
      phone          TEXT,
      qq             TEXT,
      sex            TEXT,
      stuno          TEXT,
      grade_class_id TEXT
  );`);
      await runSqlite(`CREATE TABLE s_student_score (
      id            TEXT PRIMARY KEY
                         UNIQUE
                         NOT NULL,
      create_by     TEXT,
      create_time   TEXT,
      remarks       TEXT,
      update_by     TEXT,
      update_time   TEXT,
      score         TEXT,
      type          TEXT,
      course_id     TEXT,
      student_id    TEXT,
      gradeclass_id TEXT
  );`);
      await runSqlite(`CREATE TABLE s_teacher (
      id          TEXT PRIMARY KEY
                       UNIQUE
                       NOT NULL,
      create_by   TEXT,
      create_time TEXT,
      remarks     TEXT,
      update_by   TEXT,
      update_time TEXT,
      name        TEXT,
      phone       TEXT,
      qq          TEXT,
      sex         TEXT,
      teach_no    TEXT,
      course_id   TEXT
  );`);
      await runSqlite(`CREATE TABLE sys_role (
      id          TEXT PRIMARY KEY
                       UNIQUE
                       NOT NULL,
      create_by   TEXT,
      create_time TEXT,
      remarks     TEXT,
      update_by   TEXT,
      update_time TEXT,
      code        TEXT,
      name        TEXT
  );`);
      let time = Date.now();
      await insertData('sys_role', [
        {
          id: 'root',
          create_time: time,
          create_by: 'root',
          remarks: '系统管理员',
          update_by: 'root',
          update_time: time,
          name: '系统管理员',
          code: 'ROLE_ADMIN',
        },
        {
          id: nanoid(),
          create_time: time,
          create_by: 'root',
          remarks: '普通用户',
          update_by: 'root',
          update_time: time,
          name: '普通用户',
          code: 'ROLE_USER',
        },
      ]);
      await insertData('sys_user', [
        {
          id: 'root',
          create_time: time,
          create_by: 'root',
          remarks: '管理员',
          update_by: 'root',
          update_time: time,
          password: '0e65ebba95ab',
          realname: 'admin',
          sex: '男',
          status: '1',
          username: 'admin',
          email: '123@qq.com',
          role_id: 'root',
        },
      ]);
    } catch (error) { }
  });
//登录接口
route.post('/login', async (req, res) => {
  try {
    let { username, password } = req.body;
    password = encryption(password);

    let ruser = await queryData(
      'sys_user',
      '*',
      `WHERE (id=? OR username=? OR realname=? OR email=?) AND status=?`,
      [username, username, username, username, '1']
    );
    if (ruser.length === 0) {
      _err(res, '账号不存在~');
      return;
    }
    //验证密码
    let _userinfo = ruser.find((item) => item.password === password);
    if (_userinfo) {
      let token = jwten(_userinfo.id);
      let role = await queryData('sys_role', '*', `WHERE id=?`, [
        _userinfo.role_id,
      ]);
      role = role.length > 0 ? role[0] : '';
      delete _userinfo.state;
      delete _userinfo.password;
      _success(res, '登录成功~', { ..._userinfo, token, role });
    } else {
      _err(res, '登录密码错误~');
    }
  } catch (error) {
    _err(res);
  }
});
route.use((req, res, next) => {
  if (!req._userInfo.id) {
    _nologin(res);
    return;
  }
  next()
});
//获取所有角色
route.get('/allrole', async (req, res) => {
  try {
    let roleArr = await queryData('sys_role', '*');
    _success(res, 'ok', roleArr);
  } catch (error) {
    _err(res);
  }
});


// 首页统计信息
route.get('/totaldata', async (req, res) => {
  try {
    let studentTotal = (await queryData('s_student', `count(*)`))[0][
      'count(*)'
    ];
    let classTotal = (await queryData('s_grade_class', `count(*)`))[0][
      'count(*)'
    ];
    let teacherTotal = (await queryData('s_teacher', `count(*)`))[0][
      'count(*)'
    ];
    let courseTotal = (await queryData('s_course', `count(*)`))[0]['count(*)'];
    _success(res, 'ok', {
      studentTotal,
      classTotal,
      teacherTotal,
      courseTotal,
    });
  } catch (error) {
    _err(res);
  }
});


route.use((req, res, next) => {
  let role = req._userInfo.role
  if (role && role.code === 'ROLE_ADMIN') {
    next();
  } else {
    _nologin(res);
  }
});
//获取用户列表
route.get('/userlist', async (req, res) => {
  try {
    let {
      pageIndex = 1,
      pageSize = 10,
      status: sta,
      searchValue = '',
    } = req.query;
    let userList = await queryData('sys_user', '*');
    let roleArr = await queryData('sys_role', '*');
    let resArr = [];
    userList.reverse();
    userList = userList.forEach((item) => {
      let {
        id,
        username,
        realname,
        sex,
        email,
        status,
        create_time,
        role_id,
        remarks,
      } = item;
      let role = roleArr.find((item) => item.id === role_id);
      role = role || {};
      let str = `${username}|${realname}|${sex}|${email}|${role.name || ''}`;
      if (!str.includes(searchValue)) return;
      if (!sta) {
        resArr.push({
          id,
          username,
          realname,
          sex,
          email,
          status,
          create_time,
          role_id,
          sysRole: role,
          remarks,
        });
      } else {
        if (sta == status) {
          resArr.push({
            id,
            username,
            realname,
            sex,
            email,
            status,
            create_time,
            role_id,
            sysRole: role,
            remarks,
          });
        }
      }
    });
    let totalNum = resArr.length;
    let totalPage = Math.ceil(totalNum / pageSize);
    pageIndex < 0
      ? (pageIndex = 0)
      : pageIndex > totalNum
        ? (pageIndex = totalNum)
        : null;
    let content = resArr.slice(
      (pageIndex - 1) * pageSize,
      pageIndex * pageSize
    );
    _success(res, 'ok', {
      totalNum,
      totalPage,
      pageIndex,
      content,
    });
  } catch (error) {
    _err(res);
  }
});


//添加用户
route.post('/adduser', async (req, res) => {
  try {
    let {
      username,
      status = 1,
      realname,
      email,
      sex = '男',
      remarks,
      roleId,
    } = req.body;
    let id = nanoid();
    let time = Date.now();
    await insertData('sys_user', [
      {
        id,
        create_time: time,
        create_by: req._userInfo.id,
        remarks,
        update_by: req._userInfo.id,
        update_time: time,
        password: '0e65ebba95ab',
        realname,
        sex,
        status,
        username,
        email,
        role_id: roleId,
      },
    ]);
    _success(res, '添加用户成功');
  } catch (error) {
    _err(res);
  }
});

//删除用户
route.delete('/deluser', async (req, res) => {
  try {
    let { id } = req.query;
    await deleteData('sys_user', `WHERE id=?`, [id]);
    _success(res, '删除用户成功');
  } catch (error) {
    _err(res);
  }
});

//获取用户信息
route.get('/getuser', async (req, res) => {
  try {
    let { id } = req.query;
    let user = await queryData('sys_user', '*', `WHERE id=?`, [id]);
    if (user.length === 0) {
      _err(res);
      return;
    }
    let obj = user[0];
    delete obj.password;
    let role = await queryData('sys_role', '*', `WHERE id=?`, [obj.role_id]);
    role = role[0] || {};
    _success(res, 'ok', {
      ...obj,
      roleId: role.id || '',
    });
  } catch (error) {
    _err(res);
  }
});

// 更新用户信息
route.put('/updateuser', async (req, res) => {
  try {
    let {
      id,
      username,
      status = 1,
      realname,
      email,
      sex = '男',
      remarks,
      roleId,
    } = req.body;
    let time = Date.now();
    await updateData(
      'sys_user',
      {
        remarks,
        update_by: req._userInfo.id,
        update_time: time,
        realname,
        sex,
        status,
        username,
        email,
        role_id: roleId,
      },
      `WHERE id=?`,
      [id]
    );

    _success(res, '更新用户信息成功');
  } catch (error) {
    _err(res);
  }
});

module.exports = route;
