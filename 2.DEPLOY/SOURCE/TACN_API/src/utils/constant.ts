export const IS_ACTIVE = {
  ACTIVE: 1,
  INACTIVE: 0,
};

export const USER_STATUS = {
  ACTIVE: 1,
  INACTIVE: 0,
};

export const GENDER = {
  MALE: 1,
  FEMALE: 0,
};

export const PAYMENT_TYPE = {
  CASH: 1,
  TRANSFER: 2,
};

export const SALE_TYPE = {
  WHOLESALE: 1,
  RETAIL: 2,
  RETURN: 3,
};

export const VOUCHER = {
  RECEIPT: 1,
  PAYMENT: 2,
};

export const INVOICE_OBJECT = {
  CUSTOMER: 1,
  SUPPLIER: 2,
};

export const ROLE = {
  ADMIN: 1,
  STAFF: 2,
  AGENT: 3,
};

export const TRANSACTION_TYPE = {
  RECEIVE_GOODS: 1, // Nhập hàng từ NCC
  SALE_GOODS_WHOLESALE: 2, // tạo phiếu bán buôn
  SALE_GOODS_RETAIL: 3, // tạo phiếu bán lẻ
  RETURN_MONEY_ORDER: 14, // Hoàn trả tiền cho khách hàng
  RETURN_GOODS: 4, // Trả hàng
  INVOICE_RECEIPT: 5, // phiếu thu
  INVOICE_PAYMENT: 6, // phiếu chi
  PAY: 7, // thanh toán
  DELETE_RECEIVE_GOODS: 8, // xoá phiếu nhập hàng
  RETURN_MONEY_RECEIVE: 12, // trả tiền cho quản trị
  RETURN_MONEY_RETURN: 13, // trả tiền nhà cung cấp
  DELETE_RETURN_GOODS: 9, // xoá phiếu trả hàng
  DELETE_SALE_GOODS_WHOLESALE: 10, // xoá phiếu bán buôn
  DELETE_SALE_GOODS_RETAIL: 11, // xoá phiếu bán lẻ
};

export const DEFAULT_CONFIG = {
  PASSWORD: 1,
};

export const CONFIG = {
  CRYPT_SALT: 10,
  PAGING_LIMIT: 24,
  PAGING_LIMIT_TRANSACTION: 10,
  RESET_PASSWORD: "Base123a@",
  MAX_IMAGE: 5,
  OTP_FAIL_COUNT: 3,
  EXP_OTP: 60,
  EXP_PASSWORD: 60,
  HOT_LINE: "0394202944",
  LOGIN_FAIL_COUNT: 4,
  LIMIT_POST_ECOMMERCE: 5,
  LIMIT_SIMILAR_PRODUCT: 5,
  LIMIT_POST_HISTORY: 10,
};

export const apiCode = {
  SUCCESS: { code: 1, message: "Thành công" },
  DB_ERROR: { code: 2, message: "Truy vấn lỗi" },
  OTP_FAIL: { code: 3, message: "OTP không chính xác" },
  DELETE_IMAGE_ERROR: { code: 4, message: "Lỗi xoá ảnh" },
  ACCOUNT_EXIST: { code: 5, message: "Tài khoản đã tồn tại" },
  ACCOUNT_NOTFOUND: { code: 5, message: "Tài khoản đã tồn tại" },
  SERVICE_EXIST: { code: 5, message: "Dịch vụ đã tồn tại" },
  LOGIN_FAIL: { code: 6, message: "Sai tài khoản hoặc mật khẩu" },
  LOCK_ACCOUNT: { code: 7, message: "Tài khoản của bạn đã khóa " },
  OTP_FAIL_OVER: {
    code: 8,
    message: "Bạn đã gửi OTP quá số lần cho phép vui lòng thử lại sau 24h",
  },
  INVALID_PARAM: { code: 9, message: "Tham số không hợp lệ" },
  EXP_OTP: { code: 10, message: "OTP hết hiệu lực" },
  NOT_FOUND: { code: 11, message: "Dữ liệu không tồn tại " },
  NOT_DELETE_CATEGORY_UCONNECT: {
    code: 11,
    message: "Không được phép xóa danh mục",
  },
  DATA_EXIST: { code: 11, message: "Dữ liệu đã tồn tại" },
  FB_ERROR: { code: 12, message: "" },
  UNAUTHORIZED: { code: 403, message: "Không có quyền truy cập" },
  INVALID_ACCESS_TOKEN: { code: 403, message: "Vui lòng đăng nhập lại" },
  NO_PERMISSION: { code: 13, message: "Không có quyền thực hiện chức năng" },
  ACCOUNT_NOT_EXIST: { code: 14, message: "Tài khoản không tồn tại" },
  UPDATE_USER_ERROR: { code: 15, message: "Lỗi cập nhật tài khoản" },
  PAGE_ERROR: { code: 16, message: "Lỗi truyền trang" },
  NOT_DELETE_SUPER_ADMIN: { code: 17, message: "Không thế xóa super admin" },
  UPDATE_FAIL: { code: 18, message: "Cập nhật không thành công" },
  DATA_NOT_EXIST: { code: 19, message: "Dữ liệu không tồn tại" },
  PRODUCT_NOT_EXIST: { code: 19, message: "Sản phẩm không tồn tại" },
  ORDER_NOT_EXIST: { code: 19, message: "Đơn hàng không tồn tại" },
  OFFER_NOT_EXIST: { code: 19, message: "Đơn hàng không phải của bạn!" },
  PASSWORD_FAIL: { code: 20, message: "Mật khẩu không chính xác" },
  UPLOAD_FAILED: { code: 21, message: "Upload thất bại" },
  CATEGORY_NOT_FOUND: { code: 22, message: "Danh mục không tồn tại " },
  EXIST_OWNER: {
    code: 22,
    message:
      "Bạn không thể thực hiện yêu cầu này do hồ sơ của bạn chưa được duyệt",
  },
  EXIST_TEAM_OWNER: {
    code: 36,
    message:
      "Bạn không thể thực hiện yêu cầu này do hồ sơ chủ đội xe của bạn chưa được duyệt",
  },

  LOGIN_FAIL_OVER: {
    code: 23,
    message:
      "Bạn đã đăng nhập sai quá số lần cho phép vui lòng thử lại sau 24h",
  },
  PRICE_OFFER_EXIST: { code: 24, message: "Bạn đã báo giá cho đơn hàng này" },
  STOPPED_PRICE_OFFER: { code: 25, message: "Đơn hàng đã ngừng nhận báo giá" },
  REQUEST_ACCEPTED: {
    code: 26,
    message: "Yêu cầu đã được duyệt không thể thay đổi trạng thái",
  },
  TEAM_OWNER_EXIST_IN_PROJECT: {
    code: 27,
    message: "Chủ đội xe đã tồn tại trong dự án",
  },
  UNFINISHED_PROFILE: {
    code: 28,
    message: "Mời hoàn thành hồ sơ để thực hiện yêu cầu",
  },
  BRAND_NEW_VEHICLE_EXIST: {
    code: 29,
    message: "Mã xe đã tồn tại vui lòng thử lại",
  },
  VEHICLE_CATEGORY_EXIST: {
    code: 29,
    message: "Đã tồn tại loại xe này trong hệ thống.",
  },
  VEHICLE_BRAND_EXIST: {
    code: 29,
    message: "Đã tồn tại hãng xe này trong hệ thống.",
  },
  INVALID_FILE: { code: 9, message: "File không hợp lệ" },
  ERROR_BRAND: { code: 30, message: "Đã tồn tại xe trong hãng xe" },
  ERROR_CATEGORY: { code: 30, message: "Đã tồn tại xe trong danh mục xe" },
  ERROR_PRODUCT: { code: 30, message: "Đã tồn tại sản phẩm trong danh mục" },
  PRODUCT_CATEGORY_EXISTS: {
    code: 30,
    message: "Danh mục sản phẩm đã tồn tại",
  },
  STORE_EXISTS: { code: 30, message: "Kho hàng đã tồn tại" },
  PRODUCT_EXISTS: { code: 30, message: "Sản phẩm đã tồn tại" },
  INSURANCE_EXISTS: { code: 30, message: "Bảo hiểm đã tồn tại" },
  PRODUCT_CART_EXISTS: {
    code: 30,
    message: "Sản phẩm đã tồn tại trong giỏ hàng",
  },
  INVALID_PLACE: { code: 9, message: "Địa chỉ không hợp lệ" },
  PRODUCT_NOT_EXISTS: { code: 9, message: "Sản phầm không tồn tại" },
  VEHICLE_CATEGORY_ERROR: { code: 31, message: "Loại xe không tồn tại" },
  VEHICLE_BRAND_ERROR: { code: 32, message: "Hãng xe không tồn tại" },
  PROFILE_ERROR: {
    code: 33,
    message: "Trong danh sách lựa chọn đã có hồ sơ chấp nhận hoặc từ chối",
  },
  RATE_ERROR: { code: 34, message: "Bạn đã đánh giá bài viết này rồi" },
  ERROR_TIMEOUT: {
    code: 35,
    message: "Thời gian cập nhật nhập mật khẩu mới đã hết",
  },
  ERROR_REPORT_TEAM_OWNER: {
    code: 40,
    message: "Bạn đã báo xấu chủ đội xe rồi",
  },
  ERROR_REPORT_PROJECT_OWNER: {
    code: 41,
    message: "Bạn đã báo xấu chủ dự án rồi",
  },
  USERNAME_EXIST: { code: 42, message: "Tên tài khoản đã tồn tại " },
  PHONE_EXIST: { code: 43, message: "Số điện thoại đã tồn tại " },
  STORE_EXIST: {
    code: 44,
    message: "Bạn không được phép xóa kho khi đã có nhiếu nhập hàng",
  },
  DELETE_PRODUCT_EXITS: {
    code: 45,
    message: "Không thể xoá sản phẩm vì sản phẩm bạn chọn đã có trong kho",
  },
  INVOICE_EXIST: {
    code: 46,
    message: "Đã có giao dịch sử dụng loại phiếu này!",
  },
  ACCOUNT_EXIST_ROLE: {
    code: 47,
    message: "Bạn không được phép sửa quyền của đại lí!",
  },
  PASSWORD_ERROR: {
    code: 48,
    message: "Mật khẩu mới không được phép giống mật khẩu hiện tại",
  },
  CODE_ERROR: {
    code: 49,
    message: "Mã sản phẩm đã tồn tại trong hệ thống",
  },
};
