import { db } from "../config/db";
import { HoursInterface, DayType, DayTypeWithID} from '../../types/consts'


// Update hour
export const updateHour = async(date: DayType,{time,available,notbooked,servicename,length,price}:HoursInterface): Promise<HoursInterface | null> => {
    try {
        const day_id = await db('days').select('id').where(date).first()
        const newHour = await db('hours').where({day_id:day_id.id}).where({time:time})
        .update({
                available,notbooked,servicename,length,price
            })
        .returning(['time','available','notbooked','servicename','length','price'])
        return newHour[0]    
        }
    catch (error) {
        console.error('Error at  models updating new day', error);
        throw new Error('Updating failed')   
    }
}


// export const saveDay = async({date,work}: DayType, hours: HoursInterface[]): Promise<DayType | null> => {
//     try {
//         const newDay = await db.transaction(async trx =>  {
//             const [day_id] = await trx('days').insert({date,work}).returning('id')
//             for (let i=0;i<hours.length;i++){
//                 await trx('hours').insert({
//                 day_id:day_id.id,
//                 time:hours[i].time,
//                 available:hours[i].available,
//                 notbooked:hours[i].notbooked,
//                 servicename:hours[i].servicename,
//                 length:hours[i].length,
//                 price:hours[i].price
//             })
//             }
//         return {id:day_id, date, work}
//         })
//         return newDay
//     } catch (error) {
//         console.error('Error at  models updating new day', error);
//         throw new Error('Updating failed')   
//     }
// }

// export const updateDay = async({date,work,id , hours}: DayTypeWithID): Promise<DayType | null> => {
//     try {
//         const newDay = await db.transaction(async trx =>  {
//             const [day_id] = await trx('days').where({id:id}).update({work}).returning('id')
//             for (let i=0;i<hours.length;i++){
//                 await trx('hours').where({day_id:day_id.id}).where({time:hours[i].time}).update({
//                 available:hours[i].available,
//                 notbooked:hours[i].notbooked,
//                 servicename:hours[i].servicename,
//                 length:hours[i].length,
//                 price:hours[i].price
//             })
//             }
//         return {id:day_id, date, work}
//         })
//         return newDay
//     } catch (error) {
//         console.error('Error at  models updating new day', error);
//         throw new Error('Updating failed')   
//     }
// }

export const getAllData = async() => {
    try {
        let hour
        let day
        let result = []
        const allDays = await db('days')
        .select('id','date','work')
        for(let i=0;i<allDays.length;i++){
            hour = await db('hours').where({day_id:allDays[i].id}).select('time','available','notbooked','servicename','length','price')
            day={...allDays[i], hours:hour}
            result.push(day)
        }
        return result
        }
    catch (error) {
        console.error('Error at  models geting AllData', error);
        throw new Error('Geting data failed')   
    }
}

export const checkDay = async(date:string) => {
    try {
        const dayDate = await db('days').select('id').where({date})
        return dayDate
    } catch (error) {
        console.error('Error at models at CheckDay', error);
        throw new Error('Cant check day')
        
    }
}

export const saveDay = async({date,work}: DayType, hours: HoursInterface[]): Promise<DayType | null> => {
        try {
            const dayDate = await db('days').select('id').where({date}).first()
            if(dayDate){
                const id = dayDate.id
                try {
                    const newDay = await db.transaction(async trx =>  {
                        const [day_id] = await trx('days').where({id:id}).update({work}).returning('id')
                        for (let i=0;i<hours.length;i++){
                            await trx('hours').where({day_id:day_id.id}).where({time:hours[i].time}).update({
                            available:hours[i].available,
                            notbooked:hours[i].notbooked,
                            servicename:hours[i].servicename,
                            length:hours[i].length,
                            price:hours[i].price
                        })
                        }
                    return {id:day_id, date, work}
                    })
                    return newDay
                } catch (error) {
                    console.error('Error at  models updating new day', error);
                    throw new Error('Updating failed')   
                }
            } else {
                try {
                    const newDay = await db.transaction(async trx =>  {
                    const [day_id] = await trx('days').insert({date,work}).returning('id')
                    for (let i=0;i<hours.length;i++){
                        await trx('hours').insert({
                        day_id:day_id.id,
                        time:hours[i].time,
                        available:hours[i].available,
                        notbooked:hours[i].notbooked,
                        servicename:hours[i].servicename,
                        length:hours[i].length,
                        price:hours[i].price
                        })
                }
                return {id:day_id, date, work}
            })
                return newDay
                } catch (error) {
                    console.error('Error at  models create new day', error);
                    throw new Error('Creating failed')   
                }
            }
        } catch (error) {
            console.error('Error at  models saveDay', error);
            throw new Error('SaveDay failed')   
        }
    }