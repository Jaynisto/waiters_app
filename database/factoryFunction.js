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
        const exist = await getUserByName(name)
        if(exist){
            const { id } = exist
            return await db.none("insert into shifts ( user_id, weekdays_id) values ($1, $2);", [id, days_id])
        }else{
            await storingUserNames(name)
            const { id } = exist;
            return await db.none("insert into shifts ( user_id, weekdays_id) values ($1, $2);", [id, days_id])
        }
    }

    async function userSelection(name){
        const exist = await getUserByName(name)
        return await db.manyOrNone('SELECT  * from shifts join users on shifts.user_id = users.id join weekdays on shifts.weekdays_id = weekdays.id;', [exist.id])
    }

    


    return {
        storingUserNames,
        getWeekdays,
        waitersDays,
        userSelection
    }
}