
export function style_succes_danger(target, allow) {
		if (allow) {
			$(target).addClass('bg-success').removeClass('bg-danger');
			return true;
		}	else {
			$(target).removeClass('bg-success').addClass('bg-danger');
			return false;
		}
}
