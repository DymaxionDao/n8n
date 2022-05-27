<template>
	<h1>Loading Data....</h1>
</template>

<script lang="ts">
import { showMessage } from '@/components/mixins/showMessage';
import mixins from 'vue-typed-mixins';

export default mixins(showMessage).extend({
	name: 'SSoLogin',

	data() {
		return {
			loading: false,
		};
	},

	methods: {
		async ssoLogin(tokken: string) {
			try {
				await this.$store.dispatch('users/ssoLogin', { tokken });
			} catch (error) {
				console.log('error sso', error);
				this.$showError(error, this.$locale.baseText('auth.signin.error'));
				this.loading = false;
			}
		},
	},
	mounted() {
		// this.ssoLogin(this.$route.query.tokken.toString());
	},
});
</script>
