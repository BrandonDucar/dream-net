"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticSampleDreams = exports.sampleDreams = void 0;
exports.generateSampleDreams = generateSampleDreams;
function generateSampleDreams(count) {
    if (count === void 0) { count = 10; }
    var dreams = [];
    var baseTags = [
        'AI',
        'Design',
        'Environment',
        'Education',
        'Health',
        'Finance',
        'Social',
        'Gaming',
        'Productivity',
        'Art'
    ];
    var coreTypes = ['Vision', 'Tool', 'Movement'];
    // Generate dreams using your exact pattern
    for (var i = 0; i < 3; i++) {
        var dream = {
            id: "dream-".concat(i),
            name: "Dream ".concat(i),
            creator: "0xFAKE".concat(i),
            wallet: "0xFAKE".concat(i),
            tags: [baseTags[i % baseTags.length]],
            score: 0,
            evolved: false,
            lastUpdated: new Date().toISOString(),
            coreType: coreTypes[i % coreTypes.length],
            description: "This is the seed description for Dream ".concat(i),
            image: "https://picsum.photos/seed/".concat(i, "/300/200"),
            status: 'Draft',
        };
        dreams.push(dream);
    }
    // Generate additional dreams if count > 3
    for (var i = 3; i < count; i++) {
        var dream = {
            id: "dream-".concat(i),
            name: "Dream ".concat(i),
            creator: "0xFAKE".concat(i),
            wallet: "0xFAKE".concat(i),
            tags: [baseTags[i % baseTags.length]],
            score: Math.floor(Math.random() * 100),
            evolved: Math.random() > 0.7,
            lastUpdated: new Date().toISOString(),
            coreType: coreTypes[i % coreTypes.length],
            description: "This is the seed description for Dream ".concat(i),
            image: "https://picsum.photos/seed/".concat(i, "/300/200"),
            status: 'Draft',
        };
        dreams.push(dream);
    }
    return dreams;
}
exports.sampleDreams = generateSampleDreams(12);
// Generate static sample dreams using your exact code pattern
exports.staticSampleDreams = (function () {
    var dreams = [];
    var baseTags = ['ai', 'crypto', 'music', 'edu'];
    var coreTypes = ['Vision', 'Tool', 'Movement'];
    for (var i = 0; i < 3; i++) {
        var dream = {
            id: "dream-".concat(i),
            name: "Dream ".concat(i),
            creator: "0xFAKE".concat(i),
            wallet: "0xFAKE".concat(i),
            tags: [baseTags[i % baseTags.length]],
            score: 0,
            evolved: false,
            lastUpdated: new Date().toISOString(),
            coreType: coreTypes[i % coreTypes.length],
            description: "This is the seed description for Dream ".concat(i, "."),
            image: "https://picsum.photos/seed/".concat(i, "/300/200"),
            status: 'Draft',
        };
        dreams.push(dream);
    }
    return dreams;
})();
