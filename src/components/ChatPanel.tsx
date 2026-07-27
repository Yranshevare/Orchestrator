import { theme } from "../theme";

export function ChatPanel() {
    return (
        <scrollbox
            focused
            width="100%"
            height="100%"
        >
            {Array.from({ length: 5 }).map((_, i) => (
                <box key={i} flexDirection="column">
                    <box
                        backgroundColor={theme.inputBackground}
                        paddingY={1}
                    >
                        <text fg={theme.secondary} marginX={1}>
                            ▶ Refining the authentication flow {i + 1}
                        </text>
                    </box>

                    <box padding={1} marginLeft={3}>
                        <text fg={theme.text}>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            Consequatur architecto esse dolorum et reprehenderit
                            dignissimos delectus dicta officia adipisci vel molestias
                            facilis minus reiciendis nam maiores fugiat distinctio
                            magnam minima. Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, omnis nesciunt sunt rerum explicabo consequuntur quia ipsum provident. Doloribus facilis architecto perspiciatis illum et deleniti nobis iure accusantium eos! Mollitia!
                            Dolorem neque blanditiis pariatur quas reprehenderit odit, adipisci esse beatae perferendis molestiae facilis quos quibusdam fugit laborum fugiat asperiores? A numquam tenetur corrupti. Officia ducimus et labore nobis, obcaecati cum!
                            Tempora suscipit ducimus vel accusantium placeat, praesentium itaque quibusdam eligendi consequuntur veniam ab molestiae, dolorem velit minus nemo totam quaerat! Reiciendis, esse? Asperiores, corrupti doloremque. Quo commodi expedita at modi.
                            Voluptatem accusantium esse id natus veniam porro quibusdam, necessitatibus cupiditate dolor voluptate velit vitae unde, omnis soluta similique. Aut quos numquam repudiandae laboriosam debitis aperiam reprehenderit quod quas praesentium laborum.
                            Sapiente, perferendis. Eius ipsa hic iusto ea! Quae veniam quidem dolorum neque incidunt quam. Odit suscipit perferendis nam illum corrupti hic nemo eius est dolorum, incidunt quidem maxime. Eveniet, numquam!
                        </text>
                    </box>
                </box>
            ))}
        </scrollbox>
    );
}