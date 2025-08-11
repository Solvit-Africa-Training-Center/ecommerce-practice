import { Op, WhereOptions, Order } from "sequelize";

interface FilterOptions {
  // List of fields to apply a keyword search on
  searchFields?: string[];

  // Extra key-value filters to include in the query
  extraFilters?: Record<string, any>;
}

/**
 * Builds Sequelize query parameters for common API filtering needs.
 *
 * Supports:
 *  - Pagination (page, limit)
 *  - Sorting (sortBy, order)
 *  - Keyword search across multiple fields
 *  - Extra custom filters
 *  - Date range filtering (startDate, endDate)
 *
 * @param query - Incoming request query parameters
 * @param options - Optional configuration for search and extra filters
 * @returns Object containing Sequelize `where`, `limit`, `offset`, and `order`
 */
export function buildQueryParams(
  query: Record<string, any>,
  options: FilterOptions = {}
): { where: WhereOptions<any>; limit: number; offset: number; order: Order } {
  // --- Pagination ---
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10; 
  const offset = (page - 1) * limit;

  // --- Sorting ---
  const sortBy = query.sortBy || "createdAt"; // default sort field
  const order: Order = [[sortBy, query.order === "ASC" ? "ASC" : "DESC"]];

  // --- Filters ---
  const where: WhereOptions<any> = {};

  // Keyword search on multiple fields (case-insensitive)
  if (query.search && options.searchFields?.length) {
    (where as any)[Op.or] = options.searchFields.map((field) => ({
      [field]: { [Op.iLike]: `%${query.search}%` },
    }));
  }

  // Extra custom filters passed from options
  if (options.extraFilters) {
    Object.entries(options.extraFilters).forEach(([key, value]) => {
      if (value !== undefined) {
        where[key] = value;
      }
    });
  }

  // Date range filtering (if both startDate and endDate are provided)
  if (query.startDate && query.endDate) {
    where.createdAt = {
      [Op.between]: [new Date(query.startDate), new Date(query.endDate)],
    };
  }

  // Return query config for Sequelize
  return { where, limit, offset, order };
}
