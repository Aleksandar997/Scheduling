import { ResponseBase } from './responseBase';

export interface ICrudServiceBase<Tmodel, Tpaging> {
    getById(id: number): Promise<ResponseBase<Tmodel>>;
    save(model: Tmodel): Promise<ResponseBase<number>>;
}
