/**
 * DEEPSEEK AI 大模型 工具类
 */

export const AI_getAllSheet = (sheets) => {
    return sheets.map(item => {
        const { celldata } = item;
        const result = celldata.map(celldataItem => {
            const { r, c, v } = celldataItem;
            const { v: value } = v;
            return {
                r,
                c,
                value
            }
        })
        return result;
    })
}