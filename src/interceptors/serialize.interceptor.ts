import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from '@nestjs/common';

import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import {plainToClass} from 'class-transformer';

interface ClassConstructor {
    new (...args: any[]): {};
}

export function Serialize(dto : ClassConstructor){
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor{

    constructor (private dto : ClassConstructor){
    }
    intercept(context:ExecutionContext , handler:CallHandler): Observable<any>{
        // run something before a request is handled by request handler
        // console.log('Running Before Handler...',context);
        return handler.handle().pipe(
            map((data: any[]) => {
                //run something before res is send out
                //console.log(' i am running before response is send out' , data);
                return plainToClass(this.dto,data,{
                    excludeExtraneousValues : true,
                });
            })
        );
    }
}
