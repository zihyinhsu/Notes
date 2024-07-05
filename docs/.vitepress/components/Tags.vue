<script setup>
import { computed, ref } from 'vue';
import { data as postsData } from '../theme/utiles/notes.data';
import { useRouter } from 'vitepress'

const router = useRouter();
const selectedTag = ref('');

const uniqueTags = computed(() => {
    const tags = postsData.flatMap(post => post.tags).filter(tag => !tag.includes('Drama'));
    return [...new Set(tags)];
});

const filteredPosts = computed(() => {
    if (!selectedTag.value) {
        return postsData;
    }
    return postsData.filter(post => post.tags.includes(selectedTag.value));
});
function filterByTag(tag) {
    selectedTag.value = tag;
}

const queryTag = computed(() => {
    const queryTag = new URLSearchParams(window.location.search);
    if(!selectedTag.value && queryTag){
        selectedTag.value = queryTag.get('tag');
    }
    return queryTag.get('tag');
});

</script>

<template>
    <div>
        <div class="container mx-auto mt-6">
            <div class="flex space-x-4">
                <button v-for="tag,index in uniqueTags" :key="index" 
                    class="px-2 py-1 rounded-md bg-gray-200 text-primary font-bold hover:bg-gray-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition ease-in duration-150"
                    :class="{ 'bg-primary text-white hover:text-primary' : selectedTag === tag || (selectedTag === queryTag === tag) }"
                    @click="filterByTag(tag)"
                    >
                    <i class="fa-solid fa-tags mr-2"></i>
                    <span> {{ tag }} </span>
                </button> 
            </div>
            <div class="mt-4" v-for="post in filteredPosts" :key="post.title">
                <div class="flex justify-between cursor-pointer hover:font-bold hover:text-primary" @click="router.go(post.url)">
                    <h2>{{ post.title }}</h2>
                    <p>發佈於: {{ post.date }}</p>
                </div>
            </div>
        </div>
    </div>
</template>