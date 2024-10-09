import {Request, RequestHandler, Response} from "express";
import OracleDB from "oracledb";

/*
    Nampespace que contém tudo sobre "contas de usuários"
*/
export namespace AccountsHandler {
    
    /**
     * Tipo UserAccount
     */
    export type UserAccount = {
        id: number | undefined;   //Porque nao chega no bd com o id
        completeName:string;
        email:string;
        password:string | undefined;
    }; 

    async function login( email:string, password:string): Promise<UserAccount | undefined>{  //Ou retorna um user ou undefined
        //passo 1 - Conectar se ao oracle.     //Estudar promisse
        let connection = await OracleDB.getConnection({
            user:"ADMIN",
            password: "123",
            connectString: "Minha string de conexao..."
        });




        let results = await connection.execute(   //: Significa que pega da requisicao 
            'SELECT * FROM ACCOUNT WHERE email = :email AND password = :password',
            [email,password] //Parametros
        );

        console.dir(results.rows);
        if (results.rows === undefined) {
            return undefined;
        }
        else {
            //Retornar conta

            console.dir(results.rows[0]);
        }
        


    }

    export const loginHandler:RequestHandler = 
        async (req:Request, res: Response) => {
            const pEmail = req.get('email');
            const pPassword = req.get('password');

            if (pEmail && pPassword){
                await login(pEmail,pPassword)
                res.statusCode = 200;
                res.send('Login Realizado... Confira...');
            }
            else {
                res.statusCode = 400;  
                res.send('Requisição inválida - Parâmetros faltnado.');
            }

        }

}