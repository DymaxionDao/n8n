<template>
	<!-- <AuthView :form="FORM_CONFIG" :formLoading="loading" @submit="onSubmit" />
	 -->
	<h1>Loading ....</h1>
</template>

<script lang="ts">
import { showMessage } from '@/components/mixins/showMessage';
import mixins from 'vue-typed-mixins';
import AuthView from './AuthView.vue';

export default mixins(showMessage).extend({
	name: 'SSoLogin',
	components: {
		AuthView,
	},
	data() {
		return {
			loading: false,
		};
	},

	methods: {
		async ssoLogin(tokken: any) {
			try {
				const res = await this.$store.dispatch('users/ssoLogin', { tokken });
				console.log('Discpatch Completed', res);
			} catch (error) {
				console.log('error', error);
				this.$showError(error, this.$locale.baseText('auth.signin.error'));
				this.loading = false;
			}
		},
	},

	created: () => {
		console.log('beofre creaetd');
	},
	beforeMount: () => {
		console.log('beofre mount');
	},
	mounted: function () {
		this.ssoLogin(this.$route.query.tokken);
	},
});
</script>
