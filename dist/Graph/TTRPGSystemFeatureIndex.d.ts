import { IOutputHandler } from "../Abstractions/IOutputHandler";
import { GrobBonusNode } from "../index";
import { TTRPGSystemGraphModel } from ".";
import { Feature, FeatureSource } from "src/Tables/Features";
type featureSourceToNode = {
    src: FeatureSource;
    node: GrobBonusNode;
};
export interface IFeatureLoader {
    loadFeatures(source: string): Promise<Feature[]>;
}
/**
 *  handles Model operations and Data Containment,
 * Ensures that data is maintained, as well as graphlinks
*/
export declare class TTRPGSystemFeatureIndex extends TTRPGSystemGraphModel {
    protected static featureLoader: IFeatureLoader;
    protected static featureQue: featureSourceToNode[];
    static loadedFeatures: Record<string, Feature[]>;
    static loadedNameFeatures: Record<string, Record<string, Feature>>;
    static processFeatureQue_getSources(iterative?: boolean): any;
    static loadFeatureSources(sources: string[]): Promise<false | undefined>;
    static loadFeatureSource(source: string, reload?: boolean, out?: IOutputHandler): Promise<boolean | undefined>;
    static setfeatureLoader(featureLoader: IFeatureLoader): void;
    static getFeature(source: string, name: string): Feature | null;
    static getFeatures(source: string): Feature[] | null;
}
export {};
