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
		async ssoLogin(tokken: string) {
			try {
				const res = await this.$store.dispatch('users/ssoLogin', { tokken });
			} catch (error) {
				this.$showError(error, this.$locale.baseText('auth.signin.error'));
				this.loading = false;
			}
		},
	},
	mounted() {
		this.ssoLogin(this.$route.query.tokken.toString());
	},
});
</script>
