import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AdminFaqItem, AnswerFaqRequest, CartSyncRequest, CartSyncResponse, ContactMessage, ContactResponse, ErrorResponse, HealthStatus, ListAdminFaqsParams, PlaceOrderRequest, PlaceOrderResponse, Product, PublicFaqItem, SubmitFaqRequest, SubmitFaqResponse } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all products
 */
export declare const getListProductsUrl: () => string;
export declare const listProducts: (options?: RequestInit) => Promise<Product[]>;
export declare const getListProductsQueryKey: () => readonly ["/api/products"];
export declare const getListProductsQueryOptions: <TData = Awaited<ReturnType<typeof listProducts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listProducts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListProductsQueryResult = NonNullable<Awaited<ReturnType<typeof listProducts>>>;
export type ListProductsQueryError = ErrorType<unknown>;
/**
 * @summary List all products
 */
export declare function useListProducts<TData = Awaited<ReturnType<typeof listProducts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get a single product by ID
 */
export declare const getGetProductUrl: (id: string) => string;
export declare const getProduct: (id: string, options?: RequestInit) => Promise<Product>;
export declare const getGetProductQueryKey: (id: string) => readonly [`/api/products/${string}`];
export declare const getGetProductQueryOptions: <TData = Awaited<ReturnType<typeof getProduct>>, TError = ErrorType<ErrorResponse>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProduct>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getProduct>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetProductQueryResult = NonNullable<Awaited<ReturnType<typeof getProduct>>>;
export type GetProductQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get a single product by ID
 */
export declare function useGetProduct<TData = Awaited<ReturnType<typeof getProduct>>, TError = ErrorType<ErrorResponse>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProduct>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all product categories
 */
export declare const getListCategoriesUrl: () => string;
export declare const listCategories: (options?: RequestInit) => Promise<string[]>;
export declare const getListCategoriesQueryKey: () => readonly ["/api/categories"];
export declare const getListCategoriesQueryOptions: <TData = Awaited<ReturnType<typeof listCategories>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCategories>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listCategories>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListCategoriesQueryResult = NonNullable<Awaited<ReturnType<typeof listCategories>>>;
export type ListCategoriesQueryError = ErrorType<unknown>;
/**
 * @summary List all product categories
 */
export declare function useListCategories<TData = Awaited<ReturnType<typeof listCategories>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCategories>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Place a new order
 */
export declare const getPlaceOrderUrl: () => string;
export declare const placeOrder: (placeOrderRequest: PlaceOrderRequest, options?: RequestInit) => Promise<PlaceOrderResponse>;
export declare const getPlaceOrderMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof placeOrder>>, TError, {
        data: BodyType<PlaceOrderRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof placeOrder>>, TError, {
    data: BodyType<PlaceOrderRequest>;
}, TContext>;
export type PlaceOrderMutationResult = NonNullable<Awaited<ReturnType<typeof placeOrder>>>;
export type PlaceOrderMutationBody = BodyType<PlaceOrderRequest>;
export type PlaceOrderMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Place a new order
 */
export declare const usePlaceOrder: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof placeOrder>>, TError, {
        data: BodyType<PlaceOrderRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof placeOrder>>, TError, {
    data: BodyType<PlaceOrderRequest>;
}, TContext>;
/**
 * @summary Sync cart state to database
 */
export declare const getSyncCartUrl: (sessionId: string) => string;
export declare const syncCart: (sessionId: string, cartSyncRequest: CartSyncRequest, options?: RequestInit) => Promise<CartSyncResponse>;
export declare const getSyncCartMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof syncCart>>, TError, {
        sessionId: string;
        data: BodyType<CartSyncRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof syncCart>>, TError, {
    sessionId: string;
    data: BodyType<CartSyncRequest>;
}, TContext>;
export type SyncCartMutationResult = NonNullable<Awaited<ReturnType<typeof syncCart>>>;
export type SyncCartMutationBody = BodyType<CartSyncRequest>;
export type SyncCartMutationError = ErrorType<unknown>;
/**
 * @summary Sync cart state to database
 */
export declare const useSyncCart: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof syncCart>>, TError, {
        sessionId: string;
        data: BodyType<CartSyncRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof syncCart>>, TError, {
    sessionId: string;
    data: BodyType<CartSyncRequest>;
}, TContext>;
/**
 * @summary Clear cart from database
 */
export declare const getClearCartSessionUrl: (sessionId: string) => string;
export declare const clearCartSession: (sessionId: string, options?: RequestInit) => Promise<CartSyncResponse>;
export declare const getClearCartSessionMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof clearCartSession>>, TError, {
        sessionId: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof clearCartSession>>, TError, {
    sessionId: string;
}, TContext>;
export type ClearCartSessionMutationResult = NonNullable<Awaited<ReturnType<typeof clearCartSession>>>;
export type ClearCartSessionMutationError = ErrorType<unknown>;
/**
 * @summary Clear cart from database
 */
export declare const useClearCartSession: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof clearCartSession>>, TError, {
        sessionId: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof clearCartSession>>, TError, {
    sessionId: string;
}, TContext>;
/**
 * @summary List answered FAQs for a product
 */
export declare const getListProductFaqsUrl: (id: string) => string;
export declare const listProductFaqs: (id: string, options?: RequestInit) => Promise<PublicFaqItem[]>;
export declare const getListProductFaqsQueryKey: (id: string) => readonly [`/api/products/${string}/faqs`];
export declare const getListProductFaqsQueryOptions: <TData = Awaited<ReturnType<typeof listProductFaqs>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProductFaqs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listProductFaqs>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListProductFaqsQueryResult = NonNullable<Awaited<ReturnType<typeof listProductFaqs>>>;
export type ListProductFaqsQueryError = ErrorType<unknown>;
/**
 * @summary List answered FAQs for a product
 */
export declare function useListProductFaqs<TData = Awaited<ReturnType<typeof listProductFaqs>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProductFaqs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Submit a question about a product
 */
export declare const getSubmitFaqUrl: () => string;
export declare const submitFaq: (submitFaqRequest: SubmitFaqRequest, options?: RequestInit) => Promise<SubmitFaqResponse>;
export declare const getSubmitFaqMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitFaq>>, TError, {
        data: BodyType<SubmitFaqRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof submitFaq>>, TError, {
    data: BodyType<SubmitFaqRequest>;
}, TContext>;
export type SubmitFaqMutationResult = NonNullable<Awaited<ReturnType<typeof submitFaq>>>;
export type SubmitFaqMutationBody = BodyType<SubmitFaqRequest>;
export type SubmitFaqMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Submit a question about a product
 */
export declare const useSubmitFaq: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitFaq>>, TError, {
        data: BodyType<SubmitFaqRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof submitFaq>>, TError, {
    data: BodyType<SubmitFaqRequest>;
}, TContext>;
/**
 * @summary List all FAQs (admin)
 */
export declare const getListAdminFaqsUrl: (params?: ListAdminFaqsParams) => string;
export declare const listAdminFaqs: (params?: ListAdminFaqsParams, options?: RequestInit) => Promise<AdminFaqItem[]>;
export declare const getListAdminFaqsQueryKey: (params?: ListAdminFaqsParams) => readonly ["/api/admin/faqs", ...ListAdminFaqsParams[]];
export declare const getListAdminFaqsQueryOptions: <TData = Awaited<ReturnType<typeof listAdminFaqs>>, TError = ErrorType<unknown>>(params?: ListAdminFaqsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminFaqs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAdminFaqs>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAdminFaqsQueryResult = NonNullable<Awaited<ReturnType<typeof listAdminFaqs>>>;
export type ListAdminFaqsQueryError = ErrorType<unknown>;
/**
 * @summary List all FAQs (admin)
 */
export declare function useListAdminFaqs<TData = Awaited<ReturnType<typeof listAdminFaqs>>, TError = ErrorType<unknown>>(params?: ListAdminFaqsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminFaqs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Post an answer to a FAQ (admin)
 */
export declare const getAnswerFaqUrl: (id: number) => string;
export declare const answerFaq: (id: number, answerFaqRequest: AnswerFaqRequest, options?: RequestInit) => Promise<AdminFaqItem>;
export declare const getAnswerFaqMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof answerFaq>>, TError, {
        id: number;
        data: BodyType<AnswerFaqRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof answerFaq>>, TError, {
    id: number;
    data: BodyType<AnswerFaqRequest>;
}, TContext>;
export type AnswerFaqMutationResult = NonNullable<Awaited<ReturnType<typeof answerFaq>>>;
export type AnswerFaqMutationBody = BodyType<AnswerFaqRequest>;
export type AnswerFaqMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Post an answer to a FAQ (admin)
 */
export declare const useAnswerFaq: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof answerFaq>>, TError, {
        id: number;
        data: BodyType<AnswerFaqRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof answerFaq>>, TError, {
    id: number;
    data: BodyType<AnswerFaqRequest>;
}, TContext>;
/**
 * @summary Send contact message
 */
export declare const getSendContactMessageUrl: () => string;
export declare const sendContactMessage: (contactMessage: ContactMessage, options?: RequestInit) => Promise<ContactResponse>;
export declare const getSendContactMessageMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendContactMessage>>, TError, {
        data: BodyType<ContactMessage>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof sendContactMessage>>, TError, {
    data: BodyType<ContactMessage>;
}, TContext>;
export type SendContactMessageMutationResult = NonNullable<Awaited<ReturnType<typeof sendContactMessage>>>;
export type SendContactMessageMutationBody = BodyType<ContactMessage>;
export type SendContactMessageMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Send contact message
 */
export declare const useSendContactMessage: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendContactMessage>>, TError, {
        data: BodyType<ContactMessage>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof sendContactMessage>>, TError, {
    data: BodyType<ContactMessage>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map