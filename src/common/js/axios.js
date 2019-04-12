import Vue from 'vue';
import axios from 'axios';

export default function axiosAjax(config) {
	return new Promise((resolve, reject) => {
		axios(config).then((result) => {
			resolve(result);
		}).catch((err) => {
			console.log(err);
		});
	});
};

// 拦截请求信息
axios.interceptors.request.use(function (config) {
	return config;
}, function (error) {
	console.log(error);
});

// 拦截响应信息
axios.interceptors.response.use((response) => {
	const data = response.data;
	// 按最后一次请求进行节流
}, (err) => {
	console.log(err);
});
