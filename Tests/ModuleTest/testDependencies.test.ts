import { GrobCollection , GrobGroup , type GrobNodeType , GrobDerivedNode, GrobDerivedOrigin, GrobFixedNode, TTRPGSystem , uuidv4, GrobBonusNode } from "../../src/index";
import { JsonObject, JsonMappingRecordInArrayOut, JsonClassTyped, JsonString, JsonNumber, JsonArrayClassTyped, JsonMapping } from "grobax-json-handler";
import { BASE_SCHEME } from "grobax-json-handler";
import { JSONHandler } from "grobax-json-handler";
import { DerivedCollectionController } from "./derivedController.test";
import { Feature, FeatureSource } from "../../src/Tables/Features";

    // origins
	export class GrobJDerivedOrigin extends GrobDerivedOrigin { 

		@JsonString()
		declare public symbol: string; 
		
		@JsonString()
		declare  public originKey: string ;
		
	}
	
	// NODES  
	export class GrobJDerivedNode extends GrobDerivedNode {
		@JsonString() 
		declare public name ;

		@JsonString({name : 'calculationString'})
		declare public calc:string;

		@JsonArrayClassTyped(GrobJDerivedOrigin,{name:'calcOrigins'})
		declare public origins : GrobJDerivedOrigin[];
	} 
	export class GrobJFixedNode extends GrobFixedNode {

		@JsonString() 
		declare public name ;

		@JsonNumber({name : 'standardValue'})
		declare public ___value:number
	}
	export class GrobJBonusNode extends GrobBonusNode {

		@JsonString() 
		declare public name ;

		@JsonNumber({name : 'standardValue'})
		declare public ___value:number

		@JsonString({
			name : 'featureName',
			mappingFunctions:{
				in 	: ( o : any , serialize		: (o:any) => any ) => {
					
					return {};
				},
				out : ( o : Feature , deserialize	: (o:any) => any ) => {
					return  { name: o.name , src : ""};
				}
			}
		})
		declare public featureSrc : FeatureSource;
	}
	export type GrobJNodeType = GrobJDerivedNode | GrobJFixedNode;

	

	//  COLLECTIONS 
	export class GrobCollectionDerived extends GrobCollection<GrobJDerivedNode>{ 
		@JsonString() 
		declare public name ;
		
		@JsonMappingRecordInArrayOut({KeyPropertyName:'getName', name:'data',type:GrobJDerivedNode })
		nodes_names: Record<string, GrobJDerivedNode> = {}
	} 
	export class GrobCollectionFixed extends GrobCollection<GrobJFixedNode>{

		@JsonString() 
		declare public name ;

		@JsonMappingRecordInArrayOut({KeyPropertyName:'getName', name:'data',type:GrobJFixedNode  })
		nodes_names: Record<string, GrobJFixedNode> = {}
	}
	export class GrobCollectionExtra extends GrobCollection<GrobJBonusNode>{

		@JsonString() 
		declare public name ;

		@JsonMappingRecordInArrayOut({KeyPropertyName:'getName', name:'data',type:GrobJBonusNode  })
		declare nodes_names: Record<string, GrobJBonusNode> ;
	}
	
	

	//  GROUPS 
	export class GrobGroupDerived extends GrobGroup<GrobDerivedNode>{
		
		@JsonString() 
		declare public name :string ;

		@JsonMappingRecordInArrayOut({KeyPropertyName:'getName', name:'data',type :GrobCollectionDerived  })
		collections_names: Record<string, GrobCollectionDerived > = {};

	} 
	export class GrobGroupFixed extends GrobGroup<GrobFixedNode>{
		
		@JsonString() 
		declare public name :string  ;

		@JsonMappingRecordInArrayOut({KeyPropertyName:'getName', name:'data', type :GrobCollectionFixed  })
		collections_names: Record<string,GrobCollectionFixed> = {};

	} 
	export class GrobGroupExtra extends GrobGroup<GrobBonusNode>{
		
		@JsonString() 
		declare public name :string  ;

		@JsonMappingRecordInArrayOut({KeyPropertyName:'getName', name:'data', type :GrobCollectionExtra  })
		declare collections_names: Record<string,GrobCollectionExtra> ;

	} 
	export class TTRPG_SCHEMES { 
		static PREVIEW ='mini';
	} 

	//
	//   handles Model operations and Data Containment, 
	//  Ensures that data is maintained, as well as graphlinks
	//
	@JsonObject({
		onBeforeSerialization:(self:TTRPGSystemJSONFormatting) => {},
		onAfterDeSerialization:(self:TTRPGSystemJSONFormatting, ...args ) => {
			
			// add derived and fixed to groups 
			if ( !self.fixed	 ){
				self._createGroup('fixed');
				self.fixed	 = self.getGroup('fixed')	 as GrobGroupFixed	;
			}else{
				self.data['fixed'] = self.fixed;
			}
			if ( !self.derived ){
				self._createGroup('derived');
				self.derived = self.getGroup('derived') as GrobGroupDerived;	
			}else{
				self.data['derived'] = self.derived;
			}

			// For all groups ensure that dependencies are located. 
			for(const group_key in (self as any).data ){
				const group = (self as any).data[group_key];
				group.parent = self;

				for(const col_key in (group as any).collections_names ){
					const collection : GrobCollection<GrobNodeType> = group.collections_names[col_key];
					collection.parent = group;
					group.collections_names[collection.getName()] = collection;

					for( const node_key in (collection as any).nodes_names ){
						const node = (collection as any).nodes_names[node_key];
						node.parent = collection;
						collection.nodes_names[node.getName()] = node;

						const origins : GrobDerivedOrigin[] = node.origins ?? [];
						origins.forEach( origin  => {
							let keys = origin.originKey.split('.');
							const target = self.getNode(keys[0] as any,keys[1],keys[2])
							origin.origin = target;

							node.addDependency(target)
						})
					}
				}
			}
			const groups = Object.values((self as any).data); 
		}


	})
	export class TTRPGSystemJSONFormatting extends TTRPGSystem {
		
		@JsonClassTyped ( GrobGroupFixed )
		public fixed 	: GrobGroupFixed	;

		@JsonClassTyped ( GrobGroupDerived )
		public derived 	: GrobGroupDerived	;

		@JsonString()
		@JsonString({scheme:[BASE_SCHEME,TTRPG_SCHEMES.PREVIEW]})
		public author : string = "";

		@JsonString()
		@JsonString({scheme:[BASE_SCHEME,TTRPG_SCHEMES.PREVIEW]})
		public version: string = "";
		
		@JsonString()
		@JsonString({scheme:[BASE_SCHEME,TTRPG_SCHEMES.PREVIEW]})
		public systemCodeName:string = uuidv4();
		
		@JsonString()
		@JsonString({scheme:[BASE_SCHEME,TTRPG_SCHEMES.PREVIEW]})
		public systemName:string = "";
		
		public constructor(){
			super(); 
		}
	}

	
	Array.prototype['remove'] = function(element) {
		const index = this.indexOf(element);
		if (index > -1) {
			this.splice(index, 1);
		}
		return this;
	};
	Array.prototype['contains'] = function(substring) {
		return this.includes(substring);
	};

    test('import items for test',()=>{
        expect(true).toBe(true);
    })