export enum ESearchDirection {
  '4D' = '4D',
  '8D' = '8D',
}

export class SearchDirectionSingleton {
  public static searchDirection: ESearchDirection = ESearchDirection['4D'];
}
