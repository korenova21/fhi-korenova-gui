export enum ActionType {
  Change = 'change',
  Delete = 'delete',
  New = 'new'
}

export interface ColumnAction {
  label: string;
  type: ActionType;
  cssClass?: string;
}

export interface ActionEvent<T> {
  type: ActionType;
  row: T;
}
