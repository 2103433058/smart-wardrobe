import type { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1, question: '选出最接近你身形的描述',
    options: [
      { label: 'A. 肩宽臀窄（倒三角）', value: 'inverted-triangle' },
      { label: 'B. 肩臀等宽腰线明显（沙漏）', value: 'hourglass' },
      { label: 'C. 肩臀等宽腰线不显（矩形）', value: 'rectangle' },
      { label: 'D. 臀宽肩窄（梨形）', value: 'pear' },
      { label: 'E. 腰腹丰满（苹果形）', value: 'apple' },
    ],
  },
  {
    id: 2, question: '你希望在穿搭中达到什么效果？',
    options: [
      { label: 'A. 显高挑', value: 'height' },
      { label: 'B. 显纤瘦', value: 'slim' },
      { label: 'C. 显曲线', value: 'curve' },
      { label: 'D. 显利落干练', value: 'sharp' },
      { label: 'E. 舒适就好', value: 'comfort' },
    ],
  },
  {
    id: 3, question: '有没有你特别想修饰的部位？（可多选）',
    options: [
      { label: 'A. 手臂', value: 'arms' },
      { label: 'B. 腰腹', value: 'waist' },
      { label: 'C. 臀部/大腿', value: 'hips' },
      { label: 'D. 小腿', value: 'calves' },
      { label: 'E. 胸部', value: 'chest' },
      { label: 'F. 脖子', value: 'neck' },
      { label: 'G. 没有', value: 'none' },
    ],
  },
  {
    id: 4, question: '下面哪组词最能描述你想要的穿搭感觉？',
    options: [
      { label: 'A. 简约/干净/质感', value: 'minimalist' },
      { label: 'B. 甜美/温柔/女性化', value: 'sweet' },
      { label: 'C. 帅气/利落/中性', value: 'tomboy' },
      { label: 'D. 个性/街头/潮流', value: 'street' },
      { label: 'E. 优雅/知性/轻熟', value: 'elegant' },
      { label: 'F. 活力/运动/休闲', value: 'sporty' },
    ],
  },
  {
    id: 5, question: '逛街时你最容易心动的单品是？',
    options: [
      { label: 'A. 基础款（白T、牛仔裤）', value: 'minimalist' },
      { label: 'B. 连衣裙', value: 'sweet' },
      { label: 'C. 西装/衬衫', value: 'tomboy' },
      { label: 'D. 卫衣/运动鞋', value: 'sporty' },
      { label: 'E. 设计感强的单品', value: 'street' },
      { label: 'F. 针织/毛衣', value: 'elegant' },
    ],
  },
  {
    id: 6, question: '你最常穿的鞋子是？',
    options: [
      { label: 'A. 运动鞋/帆布鞋', value: 'sporty' },
      { label: 'B. 乐福鞋/牛津鞋', value: 'elegant' },
      { label: 'C. 高跟鞋/靴子', value: 'sweet' },
      { label: 'D. 凉鞋/拖鞋', value: 'minimalist' },
      { label: 'E. 马丁靴/切尔西', value: 'tomboy' },
    ],
  },
  {
    id: 7, question: '你对图案的偏好？',
    options: [
      { label: 'A. 纯色为主', value: 'solid' },
      { label: 'B. 条纹/格子', value: 'stripes' },
      { label: 'C. 碎花/花卉', value: 'floral' },
      { label: 'D. 波点/几何', value: 'geometric' },
      { label: 'E. 字母/印花', value: 'print' },
      { label: 'F. 都可以', value: 'all' },
    ],
  },
  {
    id: 8, question: '你的配饰习惯？',
    options: [
      { label: 'A. 几乎不戴', value: 'none' },
      { label: 'B. 只戴手表或简单项链', value: 'minimal' },
      { label: 'C. 每天换耳环/项链/手链', value: 'moderate' },
      { label: 'D. 帽子/墨镜少不了', value: 'moderate' },
      { label: 'E. 丝巾/胸针等特色配饰', value: 'statement' },
    ],
  },
  {
    id: 9, question: '你衣橱里数量最多的颜色是？',
    options: [
      { label: 'A. 黑/白/灰', value: 'neutral' },
      { label: 'B. 大地色（驼/棕/米）', value: 'earth' },
      { label: 'C. 蓝色系', value: 'blue' },
      { label: 'D. 粉色/紫色系', value: 'pink' },
      { label: 'E. 红/橙/黄色系', value: 'warm' },
      { label: 'F. 绿色系', value: 'green' },
    ],
  },
  {
    id: 10, question: '你确定自己不会穿的颜色？',
    options: [
      { label: 'A. 荧光色', value: 'neon' },
      { label: 'B. 大面积红色', value: 'red' },
      { label: 'C. 粉色', value: 'pink' },
      { label: 'D. 绿色', value: 'green' },
      { label: 'E. 橙色', value: 'orange' },
      { label: 'F. 没有禁区', value: 'none' },
    ],
  },
  {
    id: 11, question: '观察手腕血管，颜色偏？',
    options: [
      { label: 'A. 偏蓝/紫（冷色调）', value: 'cool' },
      { label: 'B. 偏绿/橄榄（暖色调）', value: 'warm' },
      { label: 'C. 蓝绿都有（中性色调）', value: 'neutral' },
      { label: 'D. 看不太出来', value: 'neutral' },
    ],
  },
  {
    id: 12, question: '一个典型的工作日，你在哪里？',
    options: [
      { label: 'A. 办公室（对着装有要求）', value: 'office-formal' },
      { label: 'B. 办公室（对着装无要求）', value: 'office-casual' },
      { label: 'C. 远程/居家办公', value: 'remote' },
      { label: 'D. 户外/需要跑动', value: 'outdoor' },
      { label: 'E. 学生/校园', value: 'student' },
    ],
  },
  {
    id: 13, question: '周末你最常做什么？',
    options: [
      { label: 'A. 宅家休息', value: 'home' },
      { label: 'B. 逛街/下午茶', value: 'social' },
      { label: 'C. 户外活动/运动', value: 'active' },
      { label: 'D. 朋友聚会/约饭', value: 'social' },
      { label: 'E. 看展/探店/拍照', value: 'cultural' },
    ],
  },
  {
    id: 14, question: '未来三个月你最需要添置衣服的场合？',
    options: [
      { label: 'A. 通勤上班', value: 'commute' },
      { label: 'B. 约会/聚会', value: 'date' },
      { label: 'C. 旅行度假', value: 'travel' },
      { label: 'D. 运动健身', value: 'sports' },
      { label: 'E. 重要场合（婚礼/面试/典礼）', value: 'formal' },
    ],
  },
  {
    id: 15, question: '你的穿搭预算属于？',
    options: [
      { label: 'A. 性价比优先（快时尚）', value: 'budget' },
      { label: 'B. 中等价位（商场品牌）', value: 'mid' },
      { label: 'C. 少而精（设计师品牌）', value: 'premium' },
      { label: 'D. 混搭自由（看眼缘）', value: 'flexible' },
    ],
  },
];
