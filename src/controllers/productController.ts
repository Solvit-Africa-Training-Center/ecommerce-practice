import { ResponseService } from '../utils/response';
import { Request, Response } from 'express'



export class ProductController{
    public async getAllProducts( req: Request, res: Response){
        try{

        }catch(err){
            const { message , stack} = err as Error
            res.status(500).json({message, stack})
        }
    }

    public async getSingleProduct(req:Request, res: Response){
        try{

        } catch(err){
            const { message , stack} = err as Error
            res.status(500).json({message, stack})
        }
    }

    public async createProduct( req: Request, res: Response){
        try{

        }catch(err){
            const { message , stack} = err as Error
            res.status(500).json({message, stack})
        }
    }

    public async deleteProduct(req: Request, res:Response){
        try{

        }catch(err){

        }
    }

    public async updateProduct(req: Request, res: Response){
        try{

        }catch(err){
            const { message , stack} = err as Error
            res.status(500).json({message, stack})
        }
    }
}