export interface IOutputHandler {
    outError(msg: any): any;
    outLog(msg: any): any;
}
export declare function newOutputHandler(): IOutputHandler;
