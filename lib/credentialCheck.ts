import prisma from "@/db"

export const canUserQuery = async (userId:string) =>{
    const user = await prisma.user.findFirst({
        where:{
            id:userId
        }
    })

    if(!user){
        return false
    }
    if(user?.messageCount > 0){
        return true
    }

    if(user?.messageCount <= 0){
        if(user.isPremium){
            return true
        }
    }

    return false
}