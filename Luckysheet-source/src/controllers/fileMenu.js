/**
 * 文件菜单实现函数
 */
import { replaceHtml } from "../utils/chartUtil";
import luckysheetConfigsetting from "./luckysheetConfigsetting";

function fileNew() {}

function fileSaveAs() {}
function fileImport() {}

function fileExport() {}

function fileShear() {
	if (
		luckysheetConfigsetting &&
		luckysheetConfigsetting.menuHandler &&
		luckysheetConfigsetting.menuHandler.shear
	)
		luckysheetConfigsetting.menuHandler.shear();
}

function filePrint() {}

function fileSetting() {}

/**
 * 文档解密
 */
function fileDecryption() {
	// 添加一个内容区
	const $content =
		'<div class="luckysheet-encrypt-mask"><div class="luckysheet-encrypt-content"><div class="luckysheet-encrypt-content-title"> <span class="title">${title}</span><span class="close" id="close" title="${close}"><i class="fa fa-close" aria-hidden="true"></i></span></div><div class="luckysheet-encrypt-tips">${tips}</div><div class="luckysheet-encrypt-content-input"><i class="fa fa-lock" aria-hidden="true" /></i><input type="password" id="luckysheet-encrypt-input" aotucomplete="off" placeholder="${placeholder}"></input></div><div class="luckysheet-encrypt-content-result"></div><div class="luckysheet-encrypt-content-footer"><span class="cancel">${cancel}</span><span class="confirm">${confirm}</span></div></div></div>';
	// 添加到 body 上
	$("body").append(
		replaceHtml($content, {
			title: "文档解密",
			close: "关闭",
			tips: "请输入文档密码:",
			placeholder: "请输入文档密码",
			cancel: "取消",
			confirm: "解密",
		})
	);

	// 实现关闭
	// 注册关闭事件
	$(".luckysheet-encrypt-content-footer .cancel").click(() => {
		$(".luckysheet-encrypt-mask").remove();
	});
	$("#close").click(() => {
		$(".luckysheet-encrypt-mask").remove();
	});

	// 在输入过程中，清空 result 结果提示
	$("#luckysheet-encrypt-input").on("input", () => {
		$(".luckysheet-encrypt-content-result").text("");
	});

	// 实现应用
	$(".luckysheet-encrypt-content-footer .confirm").click(() => {
		// 将参数传递给用户
		const password = $("#luckysheet-encrypt-input").val();
		// 暂时传递明文，用户存储数据库的话，建议使用 bcrypt 进行处理
		if (
			luckysheetConfigsetting &&
			luckysheetConfigsetting.menuHandler &&
			luckysheetConfigsetting.menuHandler.decrypt
		) {
			const value = luckysheetConfigsetting.menuHandler.decrypt(password);
			if (value) {
				// 关闭
				$(".luckysheet-encrypt-mask").remove();
			} else {
				// 密码错误
				$(".luckysheet-encrypt-content-result").text("⛔️ 密码错误!");
				$("#luckysheet-encrypt-input").val("");
			}
		}
	});
}

/**
 * 文档加密
 */
function fileEncryption() {
	// 添加一个内容区
	const $content =
		'<div class="luckysheet-encrypt-mask"><div class="luckysheet-encrypt-content"><div class="luckysheet-encrypt-content-title"> <span class="title">${title}</span><span class="close" id="close" title="${close}"><i class="fa fa-close" aria-hidden="true"></i></span></div><div class="luckysheet-encrypt-tips">${tips}</div><div class="luckysheet-encrypt-content-input"><i class="fa fa-lock" aria-hidden="true" /></i><input type="password" id="luckysheet-encrypt-input" aotucomplete="off" placeholder="${placeholder}"></input></div><div class="luckysheet-encrypt-content-result"></div><div class="luckysheet-encrypt-content-footer"><span class="cancel">${cancel}</span><span class="confirm">${confirm}</span></div></div></div>';
	// 添加到 body 上
	$("body").append(
		replaceHtml($content, {
			title: "文档加密",
			close: "关闭",
			tips: "请输入文档密码:",
			placeholder: "请输入文档密码",
			cancel: "取消",
			confirm: "应用",
		})
	);

	// 实现关闭
	// 注册关闭事件
	$(".luckysheet-encrypt-content-footer .cancel").click(() => {
		$(".luckysheet-encrypt-mask").remove();
	});
	$("#close").click(() => {
		$(".luckysheet-encrypt-mask").remove();
	});

	// 实现应用
	$(".luckysheet-encrypt-content-footer .confirm").click(() => {
		// 将参数传递给用户
		const password = $("#luckysheet-encrypt-input").val();
		// 暂时传递明文，用户存储数据库的话，建议使用 bcrypt 进行处理
		console.log("==> 请妥善保管密码：", password);
		if (
			luckysheetConfigsetting &&
			luckysheetConfigsetting.menuHandler &&
			luckysheetConfigsetting.menuHandler.encryption
		)
			luckysheetConfigsetting.menuHandler.encryption(password);

		// 关闭
		$(".luckysheet-encrypt-mask").remove();
	});
}

function fileHelp() {}

function fileExit() {
	// 退出的逻辑交给用户
	if (
		luckysheetConfigsetting &&
		luckysheetConfigsetting.menuHandler &&
		luckysheetConfigsetting.menuHandler.exit
	)
		luckysheetConfigsetting.menuHandler.exit();
}

export {
	fileImport,
	fileExport,
	fileNew,
	fileSaveAs,
	fileShear,
	filePrint,
	fileSetting,
	fileHelp,
	fileExit,
	fileEncryption,
	fileDecryption,
};
