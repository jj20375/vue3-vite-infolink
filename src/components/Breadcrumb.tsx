import { computed, defineComponent } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { useI18n } from "vue-i18n";
import type { RouteRecordRaw } from "vue-router";

export default defineComponent({
    name: "Breadcrumb",
    props: {
        slotDefault: {
            type: Function,
            default: () => () => {},
        },
        customClass: {
            type: String,
            default: "mb-2",
        },
    },
    emits: [],
    setup(props, { emit }) {
        const route = useRoute();
        const { t } = useI18n();
        const breadcrumbs = computed<Array<{ name: string; nameKey: string; path: RouteRecordRaw }>>((): any => {
            const homeRouter = { name: t("router.home"), nameKey: "home", path: { name: "home", params: { slug: t("router.home") } } };
            if (route.name === "home") return [homeRouter];
            return [homeRouter, { name: t(`router.${route.name as string}`), nameKey: route.name, path: route.fullPath }];
        });
        return () => (
            <>
                <div class={props.customClass}>
                    <ul class="flex flex-wrap gap-y-2 min-h-[21px]">
                        {breadcrumbs.value.map((breadcrumb) => (
                            <li class={["text-black-600 text-[14px] flex items-center", route.name === breadcrumb.nameKey ? "text-black-800" : ""]}>
                                <RouterLink to={breadcrumb.path}>{breadcrumb.name}</RouterLink>
                                {breadcrumb.path.name === "home" && breadcrumbs.value.length > 1 && <span class="mx-3 text-black-600">/</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            </>
        );
    },
});
