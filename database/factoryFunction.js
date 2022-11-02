module.exports = function waitersApp(db) {
    async function storingUserNames(names, code) {
        const insertingUserName = 'INSERT INTO users(username,password) VALUES ($1,$2);';
        await db.none(insertingUserName, [names, code])
    }

    async function getWeekdays() {
        const weekDays = await db.any('SELECT * FROM weekdays;');
        return weekDays
    }


    const getUserByName = async (name) => {
        return await db.oneOrNone('select * from users where username = $1;', [name])
    }

    const checkingExistingUsers = async (user) => {
        const timesEntered = await db.oneOrNone('select count(*) from users where username = $1;', [user])
        return timesEntered;

    }

    const codeVerification = async (code) => {
        const usersName = await db.oneOrNone('select username from users where password = $1;', [code])
        console.log("User: ", usersName)
        return usersName;
    }

    async function waitersDays(name, days_id) {
        let result
        const gettingCurrentUser = await getUserByName(name)
        const { id } = gettingCurrentUser;
        await db.none('DELETE FROM shifts WHERE user_id = $1', [id])
        if (gettingCurrentUser) {
            const { id } = gettingCurrentUser
            for (var i = 0; i < days_id.length; i++) {
                const days = days_id[i];
                console.log("day: ", days)
                result = await db.none("insert into shifts ( user_id, weekdays_id) values ($1, $2);", [id, days])
            }
            return result

        } else {
            await storingUserNames(name)
            const newUser = await getUserByName(name)
            const { id } = newUser;
            for (var i = 0; i <= days_id.length; i++) {
                const days = days_id[i];
                result = await db.none("insert into shifts ( user_id, weekdays_id) values ($1, $2);", [id, days])
            }
            return result
        }
    }

    async function userSelection(name) {
        const exist = await getUserByName(name)
        console.log("Printing Existing User: ", exist)
        return await db.manyOrNone('SELECT  * from shifts join users on shifts.user_id = users.id join weekdays on shifts.weekdays_id = weekdays.id;', [exist.id])
    }

    async function getEnteredWeekdays() {
        const weekDays = await getWeekdays();
        const daysAndUsers = weekDays.map(async (day) => {
            const sql = 'select username from shifts join users on users.id = user_id  where weekdays_id  = $1;'
            const users = await db.manyOrNone(sql, day.id)
            const gettingTheObject = users.map(user => user.username);


            return {
                ...day,
                users: gettingTheObject
            }

        });


        const data = await Promise.all(daysAndUsers)

        return data;
    }

    async function adminInfo(names, adminCode){
        const insertingUserName = 'INSERT INTO admin(adminName,adminPassword) VALUES ($1,$2);';
        await db.none(insertingUserName, [names, adminCode])
    }

    const keepDaysChecked = async user => {
        let weekdays = await getWeekdays();
        let userDays = await db.manyOrNone(` select  username, weekdays from shifts
        join users on users.id = user_id 
        join weekdays on weekdays.id = shifts.weekdays_id 
        where username = $1 `, [user]);
       console.log(userDays);
        for (let i = 0; i < weekdays.length; i++) {
            const day = weekdays[i];
            for (let j = 0; j < userDays.length; j++) {
                const user_day = userDays[j];
                if (user_day.weekdays === day.weekdays) {
                    day.checked = 'checked';
                }   

            }
        }
        return weekdays;
    }

    const adminCodeVerification = async (adminCode) => {
        const usersName = await db.one('select adminName from admin where adminPassword = $1;', [adminCode])
        console.log("User: ", usersName)
        return usersName;
    }

    return {
        storingUserNames,
        codeVerification,
        getWeekdays,
        waitersDays,
        userSelection,
        getUserByName,
        getEnteredWeekdays,
        checkingExistingUsers,
        keepDaysChecked,
        adminInfo,
        adminCodeVerification
    }
}






var days = [
    {
        day: 'Sunday',
        waiters: [
            'John',
            'Lia'
        ]
    }
]