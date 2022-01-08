/**
 * 断言和类型守卫
 * @param value 断言值
 * @param message 自定义错误信息
 * @example
 * ```ts
 * // 当断言值不为真值时，抛出断言失败错误
 * const data = 1
 * assertGuard(data === 0) // 抛出错误
 * ```
 * @example
 * ```ts
 * // 当断言值包含 typeof 时，额外提供类型守卫功能
 * const data: number | null;
 * guard(typeof data === 'number') // data 类型不为 number 时报错
 * // data 类型变为 number
 * ```
 */
export function guard(value: unknown, message?: string | Error): asserts value {
  if (!value) {
    if (message instanceof Error) {
      throw message;
    } else {
      throw new Error(message || `断言失败: [${value}]`);
    }
  }
}
