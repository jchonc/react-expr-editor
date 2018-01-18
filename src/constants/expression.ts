export enum ExpressionType {
    Logic,
    Compare
}

export enum ExpressionOperator {
    And,
    Or,
    Equal,
    NotEqual,
    IsBetween,
    IsNotBetween
}

export interface ExpressionOperand {
    name: ExpressionType;
}

export type Expression = {
    name: ExpressionType,
    operator: ExpressionOperator,
    operands?: Expression[] | string[],
    attrId?: string,
    attrCaption?: string
};