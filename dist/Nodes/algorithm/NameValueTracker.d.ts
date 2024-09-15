declare class doubleKeyedTable<TkeyOne extends string | number | symbol, TkeyTwo extends string | number | symbol, Tdata> {
    index_one: Record<TkeyOne, Record<TkeyTwo, Tdata>>;
    index_two: Record<TkeyTwo, Record<TkeyOne, Tdata>>;
    protected addData(key1: TkeyOne, key2: TkeyTwo, data: Tdata): void;
    protected shift_Two(keyTwo: TkeyTwo, newKey: TkeyTwo): void;
    protected shift_One(keyOne: TkeyOne, newKey: TkeyOne): void;
    protected remove_One(key: TkeyOne): void;
    protected remove_Two(key: TkeyTwo): void;
    protected get_one(key: TkeyOne): Tdata[];
    protected get_two(key: TkeyTwo): Tdata[];
}
export declare class DoubleKeyedIndexTracker<T> extends doubleKeyedTable<string, string, T> {
    SymbolAndKeyToComponent(symbol: string, key: string, component: T): void;
}
export declare class NameValueTracker<T> extends doubleKeyedTable<string, number, T> {
    nameToNumber(name: string, value: number, component: T): void;
    getName(name: string): T[];
    getAllFromValue(value: number): T[];
    shiftAllFromValue(value: number, newValue: number): void;
}
export {};
