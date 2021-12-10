<template>
	<view>
		<view class="uni-header">
			<view class="uni-group">
				<view class="uni-title">图标管理</view>
				<!-- <view class="uni-sub-title">点击图标即可复制图标代码</view> -->
			</view>
		</view>
		<view class="uni-container">
			<view class="icons">
				<view v-for="icon in icons" :key="icon" class="icon-item pointer">
					<view :class="'uni-icons-'+icon"></view>
					<text class="icon-text">uni-icons-{{icon}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import icons from './uni-icons.js'
	export default {
		data() {
			return {
				icons
			}
		},
		props:{
			tag: {
				type: Boolean,
				default: true
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	/* #ifndef H5 */
	page {
		padding-top: 85px;
	}
	/* #endif */
	.uni-container {
		background-color: #ffffff;
	}
	
	.icons {
		display: flex;
		flex-wrap: wrap;
	}

	.icon-item {
		display: flex;
		width: 16.6%;
		height: 120px;
		font-size: 30px;
		text-align: center;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.icon-item:hover,
	.icon-item:hover .icon-text {
		color: #007AFF;
	}

	.icon-text {
		color: #99a9bf;
		font-size: 12px;
		text-align: center;
		height: 1em;
		line-height: 1em;
		margin-top: 15px;
	}

	/* #ifdef H5 */
	@media only screen and (max-width: 500px) {
		.icon-item {
			width: 33.3%;
		}
	}
	/* #endif */
</style>
