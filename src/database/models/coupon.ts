import {Model, DataTypes, Optional, Sequelize} from 'sequelize';
import {CouponAttributes} from '../../types/userInterface';

export type CouponCreationAttributes = Optional<CouponAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Coupon extends Model<CouponAttributes, CouponCreationAttributes> implements CouponAttributes {
    public id!: number;
    public code!: string;
    public discount!: number;
    public isActive!: boolean;
    public expiredDate!: Date;
    public createdAt?: Date;
    public updatedAt?: Date;
    
    static initialize(sequelize: Sequelize): void {
  Coupon.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      discount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      expiredDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'coupons',
    },
  );
}
}