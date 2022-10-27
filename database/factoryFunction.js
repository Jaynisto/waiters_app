module.exports = function waitersApp(db){
    async function storingUserNames(names){
        const insertingUserName = 'INSERT INTO users(username) VALUES ($1);';
        await db.none(insertingUserName, [names])
    }

    async function getWeekdays(){
       return await db.any('SELECT * FROM weekdays;')
    }


    const getUserByName = async (name) => {
        return await db.oneOrNone('select * from users where  username = $1;',[name])
    }

    async function waitersDays(name, days_id){
        let result
        const gettingCurrentUser = await getUserByName(name)
        if(gettingCurrentUser ){
            const { id } = gettingCurrentUser
            for(var i = 0; i < days_id.length; i++){
                const days = days_id[i];
                console.log("day: ",days)
                result = await db.none("insert into shifts ( user_id, weekdays_id) values ($1, $2);", [id, days]) 
            }
            return result
            
        }else{
            await storingUserNames(name)
            const newUser = await getUserByName(name)
            const { id } = newUser;
            for(var i = 0; i <= days_id.length; i++){
                const days = days_id[i];
                result = await db.none("insert into shifts ( user_id, weekdays_id) values ($1, $2);", [id, days]) 
            }
            return result
        }
    }

    async function userSelection(name){
        const exist = await getUserByName(name)
        console.log("Printing Existing User: ", exist)
        return await db.manyOrNone('SELECT  * from shifts join users on shifts.user_id = users.id join weekdays on shifts.weekdays_id = weekdays.id;', [exist.id])
    }

    async function getEnteredWeekdays(){
        const gettingDays = await db.manyOrNone('SELECT * FROM shifts JOIN weekdays ON shifts.weekdays_id = weekdays.id;')
        console.log(gettingDays)
        return gettingDays;
    }
    


    return {
        storingUserNames,
        getWeekdays,
        waitersDays,
        userSelection,
        getUserByName,
        getEnteredWeekdays
    }
}