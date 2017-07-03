<template>
<div class="background-wrapper">
	<div class="content-wrapper">
		<div class="ip-wrapper">
			ip地址（当前默认127.0.0.1）<input type="text" name="addr_id">
		</div>
		<div class="port-wrapper">
			端口号（当前默认8081）<input type="text" name="port_id">
		</div>
		<div class="info-wrapper">
			本机编号(连接的时候需要填写)<input type="text" id="sender_id">
		</div>
		<div class="target-wrapper">
			发送目标<input type="text" id="target_id">
		</div>
		<div class="send-content">
			<div>发送内容</div><textarea id="send-content-id"></textarea>
		</div>
		<div class="receive-content">
			收到的内容
			<ul>
				<li v-for="content in contentList">
					<div>
						{{content.msg}}
					</div>				
				</li>
			</ul>
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
			contentList: [{
  				msg: "1"
  			},{
  				msg:"2"
  			}],
			sender: "",
			target: "",
			content: "",
			send_content: ""
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
					self.contentList.push({
						msg:msg
					})
					/*if(msg.HEAD.record_type=="SYNI") {
						;
					}*/
				}
			}
		},
		send() {
			let send_content = document.getElementById("send-content-id");
			this.content = send_content.value;
			//console.log(this.content);

			let sender_name = document.getElementById("sender_id");
			this.sender = sender_name.value;
			//console.log(this.sender);

			let target_name = document.getElementById("target_id");
			this.target = target_name.value;
			//console.log(this.target);

			this.send_content = {sender:this.sender,target:this.target,content:this.content};
			this.send_content = JSON.stringify(this.send_content);

			console.log(this.send_content);

			this.ws_server.send(this.send_content);
		}
	}
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
