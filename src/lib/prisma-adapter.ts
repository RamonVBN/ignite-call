import { Adapter } from "next-auth/adapters";
import { prisma } from "./prisma";
import { NextApiRequest, NextApiResponse, NextPageContext } from "next";
import { parseCookies, destroyCookie } from "nookies";


export function PrismaAdapter(req: NextApiRequest | NextPageContext['req'], res: NextApiResponse | NextPageContext['res'] ): Adapter {

    return {
        async createUser(user: {
            id: string,
            name: string,
            username: string,
            email: string,
            avatar_url: string,
            emailVerified: null 
        }) {

            const {'@ignitecall:userId': userIdOnCookies} = parseCookies({req})

            if (!userIdOnCookies) {
                throw new Error('User ID not found on cookies')
            }

            const prismaUser = await prisma.user.update({
                where: {
                    id: userIdOnCookies
                },
                data: {
                    name: user.name,
                    email: user.email,
                    avatar_url: user.avatar_url
                }
            })

            destroyCookie({res}, '@ignitecall:userId', {
                path: '/'
            })

            return {
                id: prismaUser.id,
                name: prismaUser.name,
                username: prismaUser.name,
                email: prismaUser.email!,
                avatar_url: prismaUser.avatar_url!,
                emailVerified: null   
            }
        },

        async getUser(id){
            const user = await prisma.user.findUnique({
                where: {
                    id
                }
            })

            if (!user) {
                
                return null
            }

            return {
                id: user.id,
                name: user.name,
                username: user.name,
                email: user.email!,
                avatar_url: user.avatar_url!,
                emailVerified: null     
            }
        },

        async getUserByEmail(email){

            const user = await prisma.user.findUnique({
                where: {
                    email
                }
            })

            if (!user) {
                return null
            }

            return {
                id: user.id,
                name: user.name,
                username: user.name,
                email: user.email!,
                avatar_url: user.avatar_url!,
                emailVerified: null     
            }
        },

        async getUserByAccount({providerAccountId, provider}){

            const account = await prisma.account.findUnique({
                where: {
                    provider_providerAccountId: {
                        provider,
                        providerAccountId
                    }
                },
                include: {
                    user: true
                }
            })

            if (!account) {
                
                return  null
            }

            const { user } = account

            return {
                id: user.id,
                name: user.name,
                username: user.name,
                email: user.email!,
                avatar_url: user.avatar_url!,
                emailVerified: null     
            }
            
        },

        async updateUser(user){

            const userUpdated = await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    name: user.name,
                    email: user.email,
                    avatar_url: user.avatar_url
                }

            })

            return {
                id: userUpdated.id,
                name: userUpdated.name,
                username: userUpdated.name,
                email: userUpdated.email!,
                avatar_url: userUpdated.avatar_url!,
                emailVerified: null     
            }

        },

        async linkAccount(account: {
            userId: string,
            type: string,
            provider: string,
            providerAccountId: string,
            refresh_token: string,
            access_token: string,
            expires_at: number,
            token_type: string,
            scope: string,
            id_token: string,
            session_state: string,
          } ) {
            await prisma.account.create({
              data: {
                userId: account.userId,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            })
        },

        async createSession({sessionToken, userId, expires}){

            await prisma.session.create({
                data: {
                    userId,
                    expires,
                    sessionToken
                }
            })

            return {
                expires,
                sessionToken,
                userId
            }
        },

        async getSessionAndUser(sessionToken){
            const prismaSession = await prisma.session.findUnique({
                where: {
                    sessionToken
                },
                include: {
                    user: true
                }
            })

            if (!prismaSession) {
                
                return null
            }

            const {user, ...session} = prismaSession

            return {
                session: {
                    userId: session.userId,
                    expires: session.expires,
                    sessionToken: session.sessionToken
                },
                user: {  
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email!,
                    avatar_url: user.avatar_url!,
                    emailVerified: null 
                }
            }
    
        },

        async updateSession({sessionToken, userId, expires}){

            const sessionUpdated = await prisma.session.update({
                where: {
                    sessionToken
                },
                data: {
                    userId,
                    expires
                }

            })

            return {
                sessionToken,
                userId: sessionUpdated.userId,
                expires: sessionUpdated.expires
            }

        },

        async deleteSession(sessionToken){

            await prisma.session.delete({
                where: {
                    sessionToken
                }
            })

        }        
    }
}