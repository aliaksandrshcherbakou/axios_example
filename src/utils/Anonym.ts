import {Buffer} from 'buffer';
/** Encode key depends on date.Now() */
export const encodeKey = (key: number, startYear = 2020): string => {
	const now = Date.now(); // must return UTC value

	const ms = now - new Date(Date.UTC(startYear, 0, 1)).valueOf(); // integer milliseconds as difference between Now and StartYear // integer milliseconds as difference between Now and StartYear
	const random = encodeBase64(Math.random().toString().substring(2)); // random integer string
	let s = '';
	const txt = ms.toString();
	const obfusKey = txt.charCodeAt(txt.length - 1) - 48; // required to change first numbers because these are not changable in general
	for (let i = 0; i < txt.length; ++i) {
		const num = txt.charCodeAt(i) - 48 + (key % (i + 1)); //  obfusKey + key % (i + 1)
		const c = num + 97 + obfusKey; // 97 + obfusKey + obfusKey + key % (i + 1)
		s += String.fromCharCode(c);
		s += random[i];
	}

	let sum = key;
	for (let i = 0; i < s.length; ++i) {
		sum += s.charCodeAt(i);
	}
	return s + String.fromCharCode((sum % (90 - 65)) + 65); // get char between 65-90 >>> A-Z
};

export const encodeBase64 = (data: string) => {
	return Buffer.from(data).toString('base64');
};
export const decodeBase64 = (data: string) => {
	return Buffer.from(data, 'base64').toString('ascii');
};

/** Returns date decoded from string */
export const decodeKey = (txt: string, key: number, startYear = 2020): Date | null => {
	let sum = key;
	for (let i = 0; i < txt.length - 1; ++i) {
		sum += txt.charCodeAt(i);
	}
	const exp = (sum % (90 - 65)) + 65;
	if (exp !== txt.charCodeAt(txt.length - 1)) {
		return null; // last symbol is checksum; if not valid than return false
	}

	let ms = 0;
	const lastNum = txt.length - 3;
	const obfusKey = (txt.charCodeAt(lastNum) - 97 - (key % (lastNum / 2 + 1))) / 2; // required to change first numbers because these are not changable in general
	for (let i = 0, n = 0; i < txt.length - 1; i += 2, ++n) {
		const num = txt.charCodeAt(i) - 97 - (key % (n + 1)) - obfusKey;
		ms = ms * 10 + num;
	}
	return new Date(ms + new Date(startYear, 0, 1).valueOf());
};
