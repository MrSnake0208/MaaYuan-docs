export const announcementNavEntries = [
  {
    text: '内测招募',
    content: `
          <p>大家好！</p>
          <p>
            这里是
            MaaYuan开发团队。目前软件已进入新功能密集迭代阶段，现面向《代号鸢》/《如鸢》玩家公开招募核心内测体验官！如果你满足以下条件，欢迎加入：
          </p>
          <p>
            ✅ 每天有较充足时间，能高频使用 MaaYuan<br />
            ✅ 愿意深度体验新功能，并主动记录使用问题<br />
            ✅ 遇到 Bug 或异常时，愿意提供截图/录屏+清晰描述<br />
            ✅ 有长期参与反馈的意愿，与项目共同成长
          </p>
          <p>✨ <strong>你将获得：</strong></p>
          <ul>
            <li>优先体验尚未公开的新功能（如智能作业适配、新版战斗逻辑等）</li>
            <li>直通开发者的专属反馈通道</li>
            <li>表现活跃者还将解锁神秘福利：周边盲盒等！</li>
          </ul>
          <p>
            📥 <strong>如何报名？</strong><br />
            如果你可以使用MaaYuan内置更新功能，请直接加入交流群：1080267646<br />
            并在入群审核中填入以下两个问题的回答：<br />
            1. 你的电脑系统是W/M/其他<br />
            2. 你的Maa鸢内置更新类型使用的是G还是M
          </p>
          <p>
            你的每一次反馈，都是 MaaYuan 变得更好的关键！<br />
            期待与你一起，打造最稳、最聪明的鸢系长草助手 💙
          </p>
    `.trim(),
  },
]

export const announcementNavMenuItems = announcementNavEntries.map(({ text, content }) => ({
  component: 'AnnouncementNavAction',
  props: {
    title: text,
    content,
  },
}))
