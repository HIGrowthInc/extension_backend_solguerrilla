import { NextFunction, Request, Response } from 'express';
import { apiErrorHandler } from '../handlers/errorHandler';
export default class UsersController {
    constructor() {
    }
    
    /**
     * Validate if user registered
     * @param req
     * @param res
     * @param next
     */
    checkUser = async (req: Request, res: Response, next: NextFunction) => {
        const {address} = req.params;
        try {
            return res.status(200).json({
                'success': true,
                'message': '',
                'data': false,
            });
        } catch (error) {
            apiErrorHandler(error, req, res, 'Check User failed.');
        }
    };

   
}
