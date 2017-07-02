<template>
<div class="background-wrapper">
	<div class="content-wrapper">
		<div class="ip-wrapper">
			<input type="text" name="addr_id">
		</div>
		<div class="port-wrapper">
			<input type="text" name="port_id">
		</div>
		<div class="send-content">
			<textarea id="send-content-id"></textarea>
		</div>
		<div class="receive-content">
			<div>
				{{content}}
			</div>
		</div>
		<button @click="connect">连接</button>
		<button @click="send">发送</button>
	</div>
</div>
</template>

<script type="text/esmascript-6">
export default {
	data() {
		return {
			ws_server: '',
			ws_cube: '',
			content: "暂时无内容"
		}
	},
	methods: {
		connect() {
			this.ws_server = new WebSocket('ws://127.0.0.1:8081');
			let self = this;
			self.ws_server.onopen = function(e) {
				alert("connect");
			}
			self.ws_server.onmessage = function(e) {
				let msg;
				msg = e.data;
				//console.log(msg);
				if(msg.replace(/(^s*)|(s*$)/g, "").length != 0){
					msg = JSON.parse(msg);
					console.log(msg);
					/*if(msg.HEAD.record_type=="SYNI") {
						;
					}*/
				}
			}
		},
		send() {
			let send_content = document.getElementById("send-content-id");
			this.content = send_content.value;
			this.content = JSON.stringify(this.content);
			this.ws_server.send(this.content);
		}
	}
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
