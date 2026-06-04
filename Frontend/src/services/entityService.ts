import type { AxiosInstance } from "axios";

export class EntityService<TModel, TCreate, TUpdate = TCreate> {
    constructor(
        private readonly endpoint: string,
        private readonly http: AxiosInstance
    ) { }

    list = async (): Promise<TModel[]> => {
        const response = await this.http.get<TModel[]>(this.endpoint);
        return response.data;
    };

    getById = async (id: string): Promise<TModel> => {
        const response = await this.http.get<TModel>(`${this.endpoint}/${id}`);
        return response.data;
    };

    create = async (payload: TCreate): Promise<TModel> => {
        const response = await this.http.post<TModel>(this.endpoint, payload);
        return response.data;
    };

    update = async (id: string, payload: TUpdate): Promise<TModel> => {
        const response = await this.http.put<TModel>(`${this.endpoint}/${id}`, payload);
        return response.data;
    };

    remove = async (id: string): Promise<void> => {
        await this.http.delete(`${this.endpoint}/${id}`);
    };
}
