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
    },
    emits: [],
    setup(props, { emit }) {
        const route = useRoute();
        const { t } = useI18n();
        const breadcrumbs = computed<Array<{ name: string; path: RouteRecordRaw }>>((): any => {
            const homeRouter = { name: t("router.home"), path: { name: "home", params: { slug: t("router.home") } } };
            return [homeRouter, { name: t(`router.${route.name as string}`), path: route.fullPath }];
        });
        return () => (
            <>
                <ul class="flex flex-wrap gap-y-2 min-h-[21px]">
                    {breadcrumbs.value.map((breadcrumb) => (
                        <li class={["text-black-600 text-[14px] flex items-center", route.name === breadcrumb.name ? "text-black-800" : ""]}>
                            <RouterLink to={breadcrumb.path}>{breadcrumb.name}</RouterLink>
                            {breadcrumb.path.name === "home" && <span class="mx-3 text-black-600">/</span>}
                        </li>
                    ))}
                </ul>
            </>
        );
    },
});
