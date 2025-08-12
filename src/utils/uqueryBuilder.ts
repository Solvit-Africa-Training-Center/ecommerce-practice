import { Op, WhereOptions, Order } from "sequelize";

interface FilterOptions {
  searchFields?: string[];
  extraFilters?: Record<string, any>;
  dateField?: string;
  maxLimit?: number;
  defaultSortBy?: string;
  allowedSortFields?: string[];
}

interface QueryParams {
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  order?: 'ASC' | 'DESC' | 'asc' | 'desc';
  search?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: any;
}

interface BuildQueryResult {
  where: WhereOptions<any>;
  limit: number;
  offset: number;
  order: Order;
  pagination: {
    page: number;
    limit: number;
    offset: number;
  };
}

export function buildQueryParams(
  query: QueryParams = {},
  options: FilterOptions = {}
): BuildQueryResult {
  const {
    searchFields = [],
    extraFilters = {},
    dateField = "createdAt",
    maxLimit = 100,
    defaultSortBy = "createdAt",
    allowedSortFields = []
  } = options;

  // Pagination
  const page = Math.max(1, Number(query.page) || 1);
  const requestedLimit = Number(query.limit) || 10;
  const limit = Math.min(Math.max(1, requestedLimit), maxLimit);
  const offset = (page - 1) * limit;

  // Sorting
  let sortBy = query.sortBy || defaultSortBy;
  if (allowedSortFields.length > 0 && !allowedSortFields.includes(sortBy)) {
    sortBy = defaultSortBy;
  }
  const orderDirection = (query.order?.toString().toUpperCase() === "ASC") ? "ASC" : "DESC";
  const order: Order = [[sortBy, orderDirection]];

  // Filters
  const where: WhereOptions<any> = {};

  // Search
  if (query.search?.toString().trim() && searchFields.length > 0) {
    const searchTerm = query.search.toString().trim();
    (where as any)[Op.or] = searchFields.map((field) => ({
      [field]: { [Op.iLike]: `%${searchTerm}%` },
    }));
  }

  // Extra filters
  Object.entries(extraFilters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      where[key] = value;
    }
  });

  // Date filtering
  if (query.startDate || query.endDate) {
    const startDate = query.startDate ? new Date(query.startDate.toString()) : null;
    const endDate = query.endDate ? new Date(query.endDate.toString()) : null;

    const isValidStart = startDate && !isNaN(startDate.getTime());
    const isValidEnd = endDate && !isNaN(endDate.getTime());

    if (isValidStart && isValidEnd) {
      where[dateField] = { [Op.between]: [startDate, endDate] };
    } else if (isValidStart) {
      where[dateField] = { [Op.gte]: startDate };
    } else if (isValidEnd) {
      where[dateField] = { [Op.lte]: endDate };
    }
  }

  return {
    where,
    limit,
    offset,
    order,
    pagination: { page, limit, offset },
  };
}

export function buildPaginatedResponse<T>(
  data: T[],
  totalCount: number,
  pagination: { page: number; limit: number; offset: number }
) {
  const { page, limit } = pagination;
  const totalPages = Math.ceil(totalCount / limit);
  
  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      itemsPerPage: limit,
    },
  };
}