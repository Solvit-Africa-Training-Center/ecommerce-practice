import { Op, WhereOptions, Order } from "sequelize";

interface FilterOptions {
  searchFields?: string[];
  extraFilters?: Record<string, any>;
}

export function buildQueryParams(
  query: Record<string, any>,
  options: FilterOptions = {}
): { where: WhereOptions<any>; limit: number; offset: number; order: Order } {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const order: Order = [[sortBy, query.order === "ASC" ? "ASC" : "DESC"]];

  // 1) Use 'WhereOptions<any>' type
  const where: WhereOptions<any> = {};

  // 2) Assign Op.or carefully - this is the fix
  if (query.search && options.searchFields?.length) {
    (where as any)[Op.or] = options.searchFields.map((field) => ({
      [field]: { [Op.iLike]: `%${query.search}%` },
    }));
  }

  if (options.extraFilters) {
    Object.entries(options.extraFilters).forEach(([key, value]) => {
      if (value !== undefined) {
        where[key] = value;
      }
    });
  }

  if (query.startDate && query.endDate) {
    where.createdAt = {
      [Op.between]: [new Date(query.startDate), new Date(query.endDate)],
    };
  }

  return { where, limit, offset, order };
}
  