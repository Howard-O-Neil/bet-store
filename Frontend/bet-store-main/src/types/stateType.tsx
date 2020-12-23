export interface StateType<T>{
    IsFetching:boolean,
    Error: any,
    Payload: T
}