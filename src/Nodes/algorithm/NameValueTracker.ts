
 
  

class doubleKeyedTable<TkeyOne extends string | number | symbol , TkeyTwo extends string | number | symbol , Tdata>{
	
	public index_one :  Record<TkeyOne, Record<TkeyTwo,Tdata>> = {} as Record<TkeyOne, Record<TkeyTwo,Tdata>>;
	public index_two :  Record<TkeyTwo, Record<TkeyOne,Tdata>> = {} as Record<TkeyTwo, Record<TkeyOne,Tdata>>;
 
	protected addData( key1 : TkeyOne , key2 : TkeyTwo , data : Tdata){
		
		if(this.index_one[key1] == undefined)
			this.index_one[key1] = {} as Record<TkeyTwo,Tdata>;
		this.index_one[key1][key2] = data;
		
		if(this.index_two[key2] == undefined)
			this.index_two[key2] = {} as Record<TkeyOne,Tdata>;
		this.index_two[key2][key1] = data;
	
	}

	protected shift_Two( keyTwo : TkeyTwo, newKey: TkeyTwo ){

		// get data
		var index_one : Record<TkeyOne,Tdata> = this.index_two[keyTwo];
		 
		// delete and update
		delete this.index_two[keyTwo];
		this.index_two[newKey] = index_one;
 
		for(const key in index_one){
			// if data exists, then update the data. 
			var data = this.index_one[key][keyTwo];
			if( data != null ){
				delete this.index_one[key][keyTwo];
				this.index_one[key][newKey] = data;
			} 
		} 
	}
	protected shift_One( keyOne : TkeyOne, newKey: TkeyOne ){

		// get data
		var index_two : Record<TkeyTwo,Tdata> = this.index_one[keyOne];
		
		// delete and update
		delete this.index_one[keyOne];
		this.index_one[newKey] = index_two;
 
		for(const key in index_two){
			// if data exists, then update the data. 
			var data = this.index_two[key][keyOne];
			if( data != null ){
				delete this.index_two[key][keyOne];
				this.index_two[key][newKey] = data;
			} 
		} 
	}

	protected remove_One(key : TkeyOne){
		var data : Record<TkeyTwo,Tdata> = {} as Record<TkeyTwo,Tdata>;
		if( this.index_one[key] != undefined ){
			data = this.index_one[key];
			delete this.index_one[key];
		}
 
		for( const key2 in data){
			delete this.index_two[key2][key];
		}
	} 
	protected remove_Two(key : TkeyTwo){
		var data : Record<TkeyOne,Tdata> = {} as Record<TkeyOne,Tdata>;
		if( this.index_two[key] != undefined ){
			data = this.index_two[key];
			delete this.index_two[key];
		}
 
		for( const key1 in data){
			delete this.index_one[key1][key];
		}
	} 

	protected get_one( key : TkeyOne ){
		var arr : Tdata[]= [];
		for( const k in this.index_one[key] ){ 
			arr.push( this.index_one[key][k] );
		}
		return arr;
	}
	protected get_two( key : TkeyTwo ){
		var arr : Tdata[]= [];
		for( const k in this.index_two[key] ){ 
			arr.push( this.index_two[key][k] );
		}
		return arr;
	}
}

export class DoubleKeyedIndexTracker<T> extends doubleKeyedTable<string,string,T>{

	public SymbolAndKeyToComponent( symbol : string , key : string , component : T ){ 
		this.remove_One(symbol);
		this.addData(symbol,key,component);
	} 
}



export class NameValueTracker<T> extends doubleKeyedTable<string,number,T>{

	public nameToNumber( name : string , value : number , component : T ){ 
		this.remove_One(name);
		this.addData(name,value,component);
	} 
 
	public getName(name : string){
		return this.get_one(name);
	}
	
	public getAllFromValue( value : number ) : T[] {
		return this.get_two(value);
	}

    public shiftAllFromValue( value : number , newValue : number ){
		this.shift_Two(value,newValue);
	}
 
}


 